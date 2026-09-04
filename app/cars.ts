export type Car = {
  id: number;
  title: string;
  year: string;
  price: string;
  image: string;
  images?: string[];
  badge: string;
  km: string;
  fuel: string;
  transmission: string;
  description: string;
};

import { generatedCatalog } from "./generated-catalog";

const normalizeCar = (car: Partial<Car> | null | undefined): Car => {
  const safeCar = car ?? {};
  const images = Array.isArray(safeCar.images) ? safeCar.images.filter(Boolean) : [];
  const primaryImage = typeof safeCar.image === "string" ? safeCar.image.trim() : "";

  return {
    id: Number(safeCar.id ?? 0),
    title: safeCar.title ?? "",
    year: safeCar.year ?? "",
    price: safeCar.price ?? "",
    image: primaryImage || images[0] || "",
    images: images.length > 0 ? images : primaryImage || images[0] ? [primaryImage || images[0]] : [],
    badge: safeCar.badge ?? "",
    km: safeCar.km ?? "",
    fuel: safeCar.fuel ?? "",
    transmission: safeCar.transmission ?? "",
    description: safeCar.description ?? "",
  };
};

const catalogSeed: Car[] = [
  {
    id: 1,
    title: "peugeot 207 compact",
    year: "2011",
    price: "$0",
    image: "/frente%20207.jpeg",
    images: [
      "/frente%20207.jpeg",
      "/costado%20207.jpeg",
      "/baul%20207.jpeg",
    ],
    badge: "Nuevo",
    km: "90.000 km",
    fuel: "Nafta",
    transmission: "manual",
    description:
      "Sedán premium con acabados de lujo, motor eficiente y un diseño sobrio ideal para uso diario y viajes largos.",
  },
  {
    id: 2,
    title: "Chevrolet Astra CON GNC",
    year: "2008",
    price: "$0",
    image: "/imagenes%20de%20los%20autos/chevriket%20astra.jpeg",
    images: ["/imagenes%20de%20los%20autos/chevriket%20astra.jpeg"],
    badge: "Destacado",
    km: "1 km",
    fuel: "Nafta",
    transmission: "manual",
    description:
      "Confort excepcional, tecnología avanzada y una presencia elegante que se destaca en cualquier entorno.",
  },
  {
    id: 3,
    title: "VOLKSWAGEN AMAROK 2.0 TDI 4X4",
    year: "2011",
    price: "$0",
    image: "/frente%20amarok.jpeg",
    images: [
      "/frente%20amarok.jpeg",
      "/baul%20amarok.jpeg",
      "/volante%20amarok.jpeg",
    ],
    badge: "Oferta",
    km: "180.000 km",
    fuel: "Diésel",
    transmission: "manual",
    description:
      "Pickup robusta, segura y muy funcional para trabajo y uso diario, con excelente presencia y equipamiento moderno.",
  },
  {
    id: 4,
    title: "FIAT SIENA 2013 FULL",
    year: "2013",
    price: "$10.000.000",
    image: "/imagenes%20de%20los%20autos/frente%20siena.jpg",
    images: [
      "/imagenes%20de%20los%20autos/frente%20siena.jpg",
      "/imagenes%20de%20los%20autos/lateral%20derecho%20siena.jpg",
      "/imagenes%20de%20los%20autos/lateral%20izquierdo%20siena.jpg",
      "/imagenes%20de%20los%20autos/baul%20siena.jpeg",
    ],
    badge: "Popular",
    km: "12.800 km",
    fuel: "Nafta",
    transmission: "Manual",
    description:
      "Fiable, económico y muy bien equipado. Ideal para quien busca un auto seguro y práctico para todos los días.",
  },
 
  {
    id: 6,
    title: "VOLKSWAGEN UP! 1.0 HIGH 5P",
    year: "2018",
    price: "$0",
    image: "/frente%20up.jpeg",
    images: [
      "/frente%20up.jpeg",
      "/costado%20up.jpeg",
      "/volante%20up.jpeg",
    ],
    badge: "COMPACTO",
    km: "19.400 km",
    fuel: "Nafta",
    transmission: "MANUAL",
    description:
      "Diseño urbano, espacio interior y gran versatilidad para la familia o uso diario con estilo.",
  },
  {
    id: 7,
    title: "FORD EXPLORER 4.0L V6",
    year: "1996",
    price: "$8.000.000",
    image: "/imagenes%20de%20los%20autos/frente%20ford%20explorer.jpeg",
    images: [
      "/imagenes%20de%20los%20autos/frente%20ford%20explorer.jpeg",
      "/imagenes%20de%20los%20autos/lateral%20derecho%20ford%20explorer.jpeg",
      "/imagenes%20de%20los%20autos/baul%20ford%20explorer.jpeg",
    ],
    badge: "Performance",
    km: "250.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Ford Explorer clásico V6 4.0L en buen estado general. Ideal para trabajos y viajes.",
  },
  ...generatedCatalog,
];

export const fallbackCarImage = "/imagenes%20de%20los%20autos/frente%20siena.jpg";

export const normalizeCarImages = (value?: string | string[]) => {
  const arr = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
  return [...new Set(arr.map((item) => String(item).trim()).filter(Boolean))];
};

export const getCarPrimaryImage = (car?: Partial<Car> | null) => {
  if (!car) return fallbackCarImage;

  const images = normalizeCarImages(car.images);
  const primary = typeof car.image === "string" ? car.image.trim() : "";

  return primary || images[0] || fallbackCarImage;
};

export const localImage = (filename: string) =>
  `/imagenes%20de%20los%20autos/${encodeURIComponent(filename)}`;

export const whatsappNumber = "542234060546";
export const whatsappBaseMessage = encodeURIComponent("Hola, quiero consultar por un auto.");

export const STORAGE_KEY = "boido-cars-v2";
const LEGACY_STORAGE_KEYS = ["boido-cars-v1", "boido-cars-v0"];

const isUsableCar = (car: Partial<Car> | null | undefined) => {
  if (!car) return false;

  const id = Number(car.id);
  const title = String(car.title ?? "").trim();
  const image = String(car.image ?? "").trim();
  const images = normalizeCarImages(car.images);

  return Number.isFinite(id) && id > 0 && (title.length > 0 || image.length > 0 || images.length > 0);
};

const hasAllBaseCatalogIds = (cars: Car[]) => {
  const savedIds = new Set(cars.map((car) => Number(car.id)).filter(Number.isFinite));
  return catalogSeed.every((car) => savedIds.has(Number(car.id)));
};

const sanitizeCatalogCars = (cars: Car[]) => {
  const seen = new Map<number, Car>();

  for (const rawCar of Array.isArray(cars) ? cars : []) {
    const normalized = normalizeCar(rawCar);

    if (!isUsableCar(normalized)) {
      continue;
    }

    const id = Number(normalized.id);
    const safeTitle = String(normalized.title ?? "").trim() || "Auto sin título";
    const safeCar: Car = {
      ...normalized,
      id,
      title: safeTitle,
      image: getCarPrimaryImage(normalized),
      images: normalizeCarImages(normalized.images).length > 0
        ? normalizeCarImages(normalized.images)
        : [getCarPrimaryImage(normalized)],
      badge: String(normalized.badge ?? "").trim(),
      km: String(normalized.km ?? "").trim(),
      fuel: String(normalized.fuel ?? "").trim(),
      transmission: String(normalized.transmission ?? "").trim(),
      description: String(normalized.description ?? "").trim(),
    };

    seen.set(id, safeCar);
  }

  return [...seen.values()].sort((a, b) => Number(b.id) - Number(a.id));
};

const defaultCatalog = () => sanitizeCatalogCars(catalogSeed.map(normalizeCar));

const clearLegacyCatalogStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage access issues.
    }
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && !saved.includes('"id"') && !saved.includes('"title"')) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage access issues.
  }
};

const writeCatalogToStorage = (cars: Car[]) => {
  const normalized = sanitizeCatalogCars(cars);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignored: large data URLs and restricted storage can fail in the browser.
  }

  return normalized;
};

export const dedupeCatalogCars = (cars: Car[]) => sanitizeCatalogCars(cars);

export const generateCarId = (cars: Car[] = []) => {
  const ids = cars.map((car) => Number(car.id)).filter(Number.isFinite);
  let nextId = Date.now();

  while (ids.includes(nextId)) {
    nextId += 1;
  }

  return nextId;
};

export function getCatalogCars(): Car[] {
  if (typeof window === "undefined") {
    return defaultCatalog();
  }

  try {
    clearLegacyCatalogStorage();

    const baseCatalog = defaultCatalog();
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseCatalog));
      } catch {
        // Ignore storage quota issues; keep using the in-memory catalog.
      }
      return baseCatalog;
    }

    try {
      const parsed = JSON.parse(saved) as Car[];
      const parsedCars = Array.isArray(parsed) ? parsed : [];
      const normalizedSaved = dedupeCatalogCars(parsedCars.map(normalizeCar));
      const repaired = normalizedSaved.length > 0 ? normalizedSaved : baseCatalog;

      if (!hasAllBaseCatalogIds(repaired)) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseCatalog));
        } catch {
          // Ignore storage quota issues; keep using the in-memory catalog.
        }
        return baseCatalog;
      }

      if (JSON.stringify(repaired) !== saved) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
        } catch {
          // Ignore storage quota issues; keep using the in-memory catalog.
        }
      }

      return repaired;
    } catch {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(baseCatalog));
      } catch {
        // Ignore storage quota issues; keep using the in-memory catalog.
      }
      return baseCatalog;
    }
  } catch {
    return defaultCatalog();
  }
}

export function saveCatalogCars(cars: Car[]) {
  if (typeof window === "undefined") {
    return dedupeCatalogCars(cars.map(normalizeCar));
  }

  const normalized = writeCatalogToStorage(cars);

  try {
    window.dispatchEvent(new CustomEvent("boido-catalog-updated", { detail: normalized }));
  } catch {
    // Ignore unsupported event environments.
  }

  return normalized;
}

export const cars = catalogSeed.map(normalizeCar);
