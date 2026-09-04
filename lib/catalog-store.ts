import { list, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Car } from "../app/cars";
import { defaultCatalog, sanitizeCatalogCars } from "../app/cars";
import { getBlobToken } from "./upload";

export const CATALOG_BLOB_PATH = "catalog.json";
const LOCAL_CATALOG_PATH = path.join(process.cwd(), "data", "catalog.json");

async function readLocalCatalogFile(): Promise<Car[] | null> {
  try {
    const raw = await readFile(LOCAL_CATALOG_PATH, "utf8");
    const payload = JSON.parse(raw) as { cars?: Car[] } | Car[];
    const cars = Array.isArray(payload) ? payload : payload.cars;
    if (!Array.isArray(cars)) return null;
    return sanitizeCatalogCars(cars);
  } catch {
    return null;
  }
}

async function writeLocalCatalogFile(cars: Car[]) {
  await mkdir(path.dirname(LOCAL_CATALOG_PATH), { recursive: true });
  await writeFile(LOCAL_CATALOG_PATH, JSON.stringify({ cars }, null, 2), "utf8");
}

export async function readCatalogFromBlob(): Promise<Car[] | null> {
  const token = getBlobToken();
  if (!token) return null;

  const { blobs } = await list({
    prefix: CATALOG_BLOB_PATH,
    token,
    limit: 20,
  });

  const file = blobs.find(
    (blob) => blob.pathname === CATALOG_BLOB_PATH || blob.pathname.endsWith("/catalog.json"),
  );
  if (!file) return null;

  const response = await fetch(file.url, { cache: "no-store" });
  if (!response.ok) return null;

  const payload = (await response.json()) as { cars?: Car[] } | Car[];
  const cars = Array.isArray(payload) ? payload : payload.cars;
  if (!Array.isArray(cars)) return null;

  return sanitizeCatalogCars(cars);
}

export async function writeCatalogToBlob(cars: Car[]) {
  const token = getBlobToken();
  const normalized = sanitizeCatalogCars(cars);
  const onVercel = Boolean(process.env.VERCEL);

  if (token) {
    await put(CATALOG_BLOB_PATH, JSON.stringify({ cars: normalized }), {
      access: "public",
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return normalized;
  }

  if (onVercel || process.env.NODE_ENV === "production") {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN. Sin eso no se puede guardar el catálogo en producción.",
    );
  }

  await writeLocalCatalogFile(normalized);
  return normalized;
}

export async function getPersistedCatalog(): Promise<Car[]> {
  const fromBlob = await readCatalogFromBlob();
  if (fromBlob && fromBlob.length > 0) return fromBlob;

  const fromFile = await readLocalCatalogFile();
  if (fromFile && fromFile.length > 0) return fromFile;

  return defaultCatalog();
}
