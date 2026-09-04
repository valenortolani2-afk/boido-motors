import {
  defaultCatalog,
  sanitizeCatalogCars,
  type Car,
} from "../app/cars";

const STORAGE_CACHE_KEY = "boido-cars-cache-v1";

async function readApiCatalog(): Promise<Car[]> {
  const response = await fetch("/api/catalog", { cache: "no-store" });
  const payload = (await response.json()) as { cars?: Car[]; error?: string };

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo leer el catálogo.");
  }

  return sanitizeCatalogCars(payload.cars ?? []);
}

function writeLocalCache(cars: Car[]) {
  try {
    window.localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(cars));
  } catch {
    // Quota / private mode.
  }
}

function readLocalCache(): Car[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_CACHE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Car[];
    return sanitizeCatalogCars(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

export async function loadCatalogCars(): Promise<Car[]> {
  try {
    const cars = await readApiCatalog();
    if (cars.length > 0) {
      writeLocalCache(cars);
      return cars;
    }
  } catch (error) {
    console.error("[catalog]", error);
  }

  const cached = readLocalCache();
  if (cached.length > 0) return cached;
  return defaultCatalog();
}

export async function persistCatalogCars(cars: Car[]): Promise<Car[]> {
  const response = await fetch("/api/catalog", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cars: sanitizeCatalogCars(cars) }),
  });
  const payload = (await response.json()) as { cars?: Car[]; error?: string };

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo guardar el catálogo.");
  }

  const saved = sanitizeCatalogCars(payload.cars ?? cars);
  writeLocalCache(saved);

  try {
    window.dispatchEvent(new CustomEvent("boido-catalog-updated", { detail: saved }));
  } catch {
    // Ignore.
  }

  return saved;
}
