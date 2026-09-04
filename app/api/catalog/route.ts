import { NextResponse } from "next/server";
import { getPersistedCatalog, writeCatalogToBlob } from "../../../lib/catalog-store";
import { sanitizeCatalogCars, type Car } from "../../cars";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cars = await getPersistedCatalog();
    return NextResponse.json({ cars });
  } catch (error) {
    console.error("[catalog GET]", error);
    return NextResponse.json(
      { error: "No se pudo leer el catálogo." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { cars?: Car[] };
    if (!Array.isArray(payload.cars)) {
      return NextResponse.json({ error: "Catálogo inválido." }, { status: 400 });
    }

    const cars = await writeCatalogToBlob(sanitizeCatalogCars(payload.cars));
    return NextResponse.json({ cars });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo guardar el catálogo.";
    console.error("[catalog PUT]", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
