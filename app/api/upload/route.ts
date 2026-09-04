import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Import @vercel/blob dynamically so the dev server won't crash if the package
  // isn't installed or the integration isn't configured. The client will fall
  // back to reading files as data URLs when the API returns an error.
  let put: typeof import("@vercel/blob").put | undefined;

  try {
    const mod = await import("@vercel/blob");
    put = mod.put;
  } catch (err) {
    console.warn("@vercel/blob not available — upload will fall back to client-side.", err);
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("file");

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (!put) {
      return NextResponse.json(
        {
          error:
            "Storage provider not configured on server. Cliente hará fallback a Data URLs.",
        },
        { status: 501 }
      );
    }

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const value = file as unknown;

        if (!(value instanceof File)) {
          throw new Error("Invalid file");
        }

        const blob = await put(`cars/${Date.now()}-${value.name}`, value as File, {
          access: "public",
        });

        return blob.url;
      })
    );

    return NextResponse.json({ urls: uploaded });
  } catch (error) {
    console.error("Blob upload failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al subir la imagen. Revisá el token de Vercel Blob y la configuración del storage.",
      },
      { status: 500 }
    );
  }
}
