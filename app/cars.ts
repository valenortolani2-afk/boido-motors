export type Car = {
  id: number;
  title: string;
  year: string;
  price: string;
  image: string;
  badge: string;
  km: string;
  fuel: string;
  transmission: string;
  description: string;
};

export const localImage = (filename: string) =>
  `/imagenes%20de%20los%20autos/${encodeURIComponent(filename)}`;

export const whatsappNumber = "542234060546";
export const whatsappBaseMessage = encodeURIComponent("Hola, quiero consultar por un auto.");

export const cars: Car[] = [
  {
    id: 1,
    title: "BMW Serie 3",
    year: "2022",
    price: "$42.500",
    image: localImage("baul explorer.jpeg"),
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
    image: localImage("chevriket astra.jpeg"),
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
    image: localImage("costado izquierda explorer.jpeg"),
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
    image: localImage("fiat palio 2013 full.jpeg"),
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
    image: localImage("frente de explorer.jpeg"),
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
    image: localImage("volkswagen up.jpeg"),
    badge: "SUV",
    km: "19.400 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Diseño urbano, espacio interior y gran versatilidad para la familia o uso diario con estilo.",
  },
];
