import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("file");

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const value = file;

      if (!(value instanceof File)) {
        throw new Error("Invalid file");
      }

      const blob = await put(`cars/${Date.now()}-${value.name}`, value, {
        access: "public",
      });

      return blob.url;
    })
  );

  return NextResponse.json({ urls: uploaded });
}
