import { NextResponse } from "next/server";
import { uploadCarImage } from "../../../lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json({ error: "No se recibió ninguna imagen." }, { status: 400 });
    }

    const uploaded = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error("Archivo inválido.");
        }
        const result = await uploadCarImage(file);
        return result.url;
      }),
    );

    return NextResponse.json({ urls: uploaded });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al subir la imagen. Revisá el token de Vercel Blob.";
    console.error("[upload]", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
