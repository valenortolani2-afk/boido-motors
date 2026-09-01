"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

type Car = {
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

const cars: Car[] = [
  {
    id: 1,
    title: "BMW Serie 3",
    year: "2022",
    price: "$42.500",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    badge: "Nuevo",
    km: "18.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Sedán premium con acabados de lujo, motor eficiente y un diseño sobrio ideal para uso diario y viajes largos.",
  },
  {
    id: 2,
    title: "Mercedes C 200",
    year: "2021",
    price: "$39.900",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    badge: "Oferta",
    km: "30.000 km",
    fuel: "Diésel",
    transmission: "Automática",
    description:
      "Un vehículo equilibrado, cómodo y sofisticado con excelente equipamiento y un comportamiento muy refinado.",
  },
  {
    id: 4,
    title: "Toyota Corolla",
    year: "2023",
    price: "$31.800",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80",
    badge: "Popular",
    km: "12.800 km",
    fuel: "Nafta",
    transmission: "Manual",
    description:
      "Fiable, económico y muy bien equipado. Ideal para quien busca un auto seguro y práctico para todos los días.",
  },
  {
    id: 5,
    title: "Volkswagen Golf GTI",
    year: "2021",
    price: "$44.100",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    badge: "Performance",
    km: "25.000 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Potencia, estilo y dinamismo para quienes buscan una experiencia más deportiva sin perder confort.",
  },
  {
    id: 6,
    title: "Renault Captur",
    year: "2022",
    price: "$28.600",
    image:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
    badge: "SUV",
    km: "19.400 km",
    fuel: "Nafta",
    transmission: "Automática",
    description:
      "Diseño urbano, espacio interior y gran versatilidad para la familia o uso diario con estilo.",
  },
];

export default function Home() {
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);

  const selectedCarIndex = useMemo(
    () => cars.findIndex((car) => car.id === selectedCar.id),
    [selectedCar.id]
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <nav className={styles.topbar}>
          <div className={styles.brand}>AUTOCLUB</div>
          <div className={styles.navActions}>
            <a href="#catalogo">Catálogo</a>
            <a href="#detalle">Detalle</a>
            <a href="https://wa.me/5491123456789" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Venta directa • 0KM y usados</p>
          <h1>Catalogo de autos</h1>
          <p className={styles.heroText}>
            Encontrá el vehículo que se adapte a tu estilo, tu rutina y tu próxima aventura.
          </p>

          <div className={styles.heroButtons}>
            <a href="#catalogo" className={styles.primaryButton}>
              Ver catálogo
            </a>
            <a
              href="https://wa.me/5491123456789?text=Hola%2C%20quiero%20consultar%20por%20un%20auto."
              target="_blank"
              rel="noreferrer"
              className={styles.secondaryButton}
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="catalogo" className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionLabel}>Nuestro stock</p>
            <h2>Autos seleccionados</h2>
          </div>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
          >
            Instagram
          </a>
        </div>

        <div className={styles.catalogGrid}>
          {cars.map((car) => (
            <article
              key={car.id}
              className={`${styles.card} ${selectedCar.id === car.id ? styles.cardActive : ""}`}
              onClick={() => setSelectedCar(car)}
            >
              <div className={styles.cardImageWrap}>
                <img src={car.image} alt={car.title} className={styles.cardImage} />
                <span className={styles.badge}>{car.badge}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTopline}>
                  <h3>{car.title}</h3>
                  <span>{car.year}</span>
                </div>
                <p className={styles.cardPrice}>{car.price}</p>
                <div className={styles.cardMeta}>
                  <span>{car.km}</span>
                  <span>{car.fuel}</span>
                </div>
                <button type="button" className={styles.cardButton}>
                  Ver publicación
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="detalle" className={styles.detailSection}>
        <div className={styles.detailImageWrap}>
          <img src={selectedCar.image} alt={selectedCar.title} className={styles.detailImage} />
        </div>

        <div className={styles.detailContent}>
          <p className={styles.sectionLabel}>Publicación seleccionada</p>
          <h2>{selectedCar.title}</h2>
          <div className={styles.detailInfoRow}>
            <span>{selectedCar.year}</span>
            <span>{selectedCar.km}</span>
            <span>{selectedCar.transmission}</span>
          </div>
          <p className={styles.detailPrice}>{selectedCar.price}</p>
          <p className={styles.detailDescription}>{selectedCar.description}</p>

          <div className={styles.detailSpecs}>
            <div>
              <span>Combustible</span>
              <strong>{selectedCar.fuel}</strong>
            </div>
            <div>
              <span>Transmisión</span>
              <strong>{selectedCar.transmission}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>{selectedCar.badge}</strong>
            </div>
          </div>

          <div className={styles.detailActions}>
            <a
              href={`https://wa.me/5491123456789?text=${encodeURIComponent(
                `Hola, me interesa el auto ${selectedCar.title}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className={styles.primaryButton}
            >
              Consultar por WhatsApp
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              className={styles.secondaryButton}
            >
              TikTok
            </a>
          </div>

          <div className={styles.pagination}>
            <button
              type="button"
              onClick={() => setSelectedCar(cars[(selectedCarIndex - 1 + cars.length) % cars.length])}
              aria-label="Auto anterior"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => setSelectedCar(cars[(selectedCarIndex + 1) % cars.length])}
              aria-label="Próximo auto"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
