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

const normalizeCar = (car: Car): Car => {
  const images = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
  const primaryImage = car.image?.trim() || images[0] || "";

  return {
    ...car,
    image: primaryImage,
    images: images.length > 0 ? images : primaryImage ? [primaryImage] : [],
  };
};

const catalogSeed: Car[] = [
  {
    id: 1,
    title: "BMW Serie 3",
    year: "2022",
    price: "$42.500",
    image: "/imagenes%20de%20los%20autos/baul%20explorer.jpeg",
    images: ["/imagenes%20de%20los%20autos/baul%20explorer.jpeg"],
    badge: "Nuevo",
    km: "18.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Sedán premium con acabados de lujo, motor eficiente y un diseño sobrio ideal para uso diario y viajes largos.",
  },
  {
    id: 2,
    title: "Chevrolet Astra CON GNC",
    year: "2008",
    price: "$5.550.000",
    image: "/imagenes%20de%20los%20autos/chevriket%20astra.jpeg",
    images: ["/imagenes%20de%20los%20autos/chevriket%20astra.jpeg"],
    badge: "Destacado",
    km: "22.500 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Confort excepcional, tecnología avanzada y una presencia elegante que se destaca en cualquier entorno.",
  },
  {
    id: 3,
    title: "Audi A4",
    year: "2020",
    price: "$35.200",
    image: "/imagenes%20de%20los%20autos/costado%20izquierda%20explorer.jpeg",
    images: ["/imagenes%20de%20los%20autos/costado%20izquierda%20explorer.jpeg"],
    badge: "Oferta",
    km: "30.000 km",
    fuel: "Diésel",
    transmission: "Automática",
    description:
      "Un vehículo equilibrado, cómodo y sofisticado con excelente equipamiento y un comportamiento muy refinado.",
  },
  {
    id: 4,
    title: "FIAT PALIO 2013 FULL",
    year: "2013",
    price: "$10.000.000",
    image: "/imagenes%20de%20los%20autos/fiat%20palio%202013%20full.jpeg",
    images: ["/imagenes%20de%20los%20autos/fiat%20palio%202013%20full.jpeg"],
    badge: "Popular",
    km: "12.800 km",
    fuel: "Nafta",
    transmission: "Manual",
    description:
      "Fiable, económico y muy bien equipado. Ideal para quien busca un auto seguro y práctico para todos los días.",
  },
  {
    id: 5,
    title: "FORD EXPLORER V6 4,0L 4X2 LIMITED",
    year: "1996",
    price: "$8.000.000",
    image: "/imagenes%20de%20los%20autos/frente%20de%20explorer.jpeg",
    images: ["/imagenes%20de%20los%20autos/frente%20de%20explorer.jpeg"],
    badge: "Performance",
    km: "25.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Potencia, estilo y dinamismo para quienes buscan una experiencia más deportiva sin perder confort.",
  },
  {
    id: 6,
    title: "VOLKSWAGEN UP! 1.0 HIGH 5P",
    year: "2018",
    price: "$14.000.000",
    image: "/imagenes%20de%20los%20autos/volkswagen%20up.jpeg",
    images: ["/imagenes%20de%20los%20autos/volkswagen%20up.jpeg"],
    badge: "SUV",
    km: "19.400 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Diseño urbano, espacio interior y gran versatilidad para la familia o uso diario con estilo.",
  },
];

export const localImage = (filename: string) =>
  `/imagenes%20de%20los%20autos/${encodeURIComponent(filename)}`;

export const whatsappNumber = "542234060546";
export const whatsappBaseMessage = encodeURIComponent("Hola, quiero consultar por un auto.");

export const STORAGE_KEY = "boido-cars-v1";

const defaultCatalog = () => dedupeCatalogCars(catalogSeed.map(normalizeCar));

const writeCatalogToStorage = (cars: Car[]) => {
  const normalized = dedupeCatalogCars(cars.map(normalizeCar));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const dedupeCatalogCars = (cars: Car[]) => {
  const seen = new Map<number, Car>();

  for (const car of Array.isArray(cars) ? cars : []) {
    const normalized = normalizeCar(car);
    const id = Number(normalized.id);

    if (!Number.isFinite(id)) {
      continue;
    }

    seen.set(id, normalized);
  }

  return [...seen.values()].sort((a, b) => Number(b.id) - Number(a.id));
};

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

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    const initial = defaultCatalog();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(saved) as Car[];
    const normalized = Array.isArray(parsed) ? dedupeCatalogCars(parsed.map(normalizeCar)) : defaultCatalog();
    const repaired = normalized.length > 0 ? normalized : defaultCatalog();

    if (JSON.stringify(repaired) !== saved) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
    }

    return repaired;
  } catch {
    const fallback = defaultCatalog();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function saveCatalogCars(cars: Car[]) {
  if (typeof window === "undefined") {
    return dedupeCatalogCars(cars.map(normalizeCar));
  }

  const normalized = writeCatalogToStorage(cars);
  window.dispatchEvent(new Event("boido-catalog-updated"));
  return normalized;
}

export const cars = catalogSeed.map(normalizeCar);
