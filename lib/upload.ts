import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);

export function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";
}

export function assertCarImageFile(file: File) {
  if (file.type && !ALLOWED.has(file.type)) {
    throw new Error("Formato no permitido. Usá JPG, PNG o WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("La imagen pesa demasiado (máx. 8 MB).");
  }
}

function extFromType(type: string, filename: string) {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName === "png" || fromName === "webp" || fromName === "gif" || fromName === "jpg" || fromName === "jpeg") {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

function safeBaseName(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return (base || "auto").slice(0, 40);
}

export async function uploadCarImage(file: File): Promise<{ url: string; storage: "blob" | "local" }> {
  assertCarImageFile(file);
  const ext = extFromType(file.type, file.name);
  const filename = `cars/${Date.now().toString(36)}-${randomBytes(4).toString("hex")}-${safeBaseName(file.name)}.${ext}`;
  const token = getBlobToken();
  const onVercel = Boolean(process.env.VERCEL);

  if (token) {
    const blob = await put(filename, file, {
      access: "public",
      token,
      contentType: file.type || `image/${ext}`,
    });
    return { url: blob.url, storage: "blob" };
  }

  if (onVercel || process.env.NODE_ENV === "production") {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN en Vercel. Sin eso no se pueden subir imágenes en producción.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads", "cars");
  await mkdir(dir, { recursive: true });
  const localName = filename.replace(/^cars\//, "");
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, localName), buffer);
  return { url: `/uploads/cars/${localName}`, storage: "local" };
}
