/**
 * Sube las fotos de public/ a Vercel Blob y guarda catalog.json
 * con las URLs públicas.
 *
 * Uso: npm run migrate:images
 * Lee BLOB_READ_WRITE_TOKEN de .env.local o del entorno.
 */

import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const SEED_PATH = path.join(ROOT, "scripts", "seed-catalog.json");

const ALIASES = {
  "frente siena.jpg": "siena frente.jpeg",
  "frente siena.jpeg": "siena frente.jpeg",
  "lateral derecho siena.jpg": "siena frente izquierda.jpeg",
  "lateral izquierdo siena.jpg": "siena izquierda.jpeg",
  "volkswagen up.jpeg": "frente up.jpeg",
  "frente de explorer.jpeg": "frente ford explorer.jpeg",
  "costado izquierda explorer.jpeg": "lateral izquierdo ford explorer.jpeg",
  "costado izquierdaexplorer.jpeg": "lateral izquierdo delantero.jpeg",
  "costado traserio explorer.jpeg": "baul ford explorer.jpeg",
};

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function collectFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, acc);
    else if (/\.(jpe?g|png|webp|gif)$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

function decodeCatalogPath(urlPath) {
  try {
    return decodeURIComponent(urlPath);
  } catch {
    return urlPath;
  }
}

function wordKey(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .sort()
    .join(" ");
}

function guessType(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function resolveLocalFile(urlPath, byName, byKey) {
  if (!urlPath.startsWith("/")) return null;
  const decoded = decodeCatalogPath(urlPath).replace(/^\//, "");
  const absDirect = path.join(PUBLIC_DIR, decoded);
  if (fs.existsSync(absDirect)) return absDirect;

  const base = path.basename(decoded).toLowerCase();
  const aliased = ALIASES[base];
  if (aliased && byName.has(aliased.toLowerCase())) return byName.get(aliased.toLowerCase());
  if (byName.has(base)) return byName.get(base);
  const keyed = byKey.get(wordKey(base));
  return keyed || null;
}

async function main() {
  loadEnvLocal();
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    console.error("Falta BLOB_READ_WRITE_TOKEN (.env.local o env).");
    process.exit(1);
  }

  const files = collectFiles(PUBLIC_DIR);
  if (files.length === 0) {
    console.error("No encontré JPG/PNG/WebP en public/. Copiá las fotos y volvé a correr npm run migrate:images");
    process.exit(1);
  }

  const byName = new Map();
  const byKey = new Map();
  for (const file of files) {
    const base = path.basename(file).toLowerCase();
    byName.set(base, file);
    byKey.set(wordKey(base), file);
  }

  const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
  console.log(`Encontré ${files.length} fotos. Subiendo a Blob...`);

  const urlMap = new Map();
  for (const file of files) {
    const buffer = fs.readFileSync(file);
    const blobPath = `cars/migrated/${path
      .relative(PUBLIC_DIR, file)
      .split(path.sep)
      .join("/")
      .replace(/[^a-zA-Z0-9._/-]+/g, "-")}`;
    const blob = await put(blobPath, buffer, {
      access: "public",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: guessType(file),
    });
    urlMap.set(file, blob.url);
    console.log(`OK ${path.basename(file)} -> ${blob.url}`);
  }

  const catalog = seed.map((car) => {
    const images = (car.images?.length ? car.images : [car.image])
      .map((src) => {
        const abs = resolveLocalFile(src, byName, byKey);
        if (abs && urlMap.has(abs)) return urlMap.get(abs);
        return src;
      })
      .filter(Boolean);
    return {
      ...car,
      image: images[0] || car.image,
      images,
    };
  });

  const catalogBlob = await put("catalog.json", JSON.stringify({ cars: catalog }), {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  const dataDir = path.join(ROOT, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "catalog.json"), JSON.stringify({ cars: catalog }, null, 2));

  console.log(`\nCatálogo guardado en Blob: ${catalogBlob.url}`);
  console.log("También quedó una copia local en data/catalog.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
