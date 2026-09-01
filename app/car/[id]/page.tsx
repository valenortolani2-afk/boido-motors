"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { getCatalogCars, type Car, whatsappNumber } from "../../cars";
import styles from "../../page.module.css";

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const selectedCar = getCatalogCars().find((item) => item.id === Number(params.id));
    setCar(selectedCar ?? null);
    setSelectedImageIndex(0);
  }, [params.id]);

  if (!car) {
    return (
      <main className={styles.page}>
        <section className={styles.detailSection}>
          <div className={styles.backLinkWrap}>
            <Link href="/" className={styles.backLink} aria-label="Volver al catálogo">
              ←
            </Link>
          </div>
          <p className={styles.emptyState}>No se encontró la publicación.</p>
        </section>
      </main>
    );
  }

  const galleryImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : [car.image];
  const currentImage = galleryImages[selectedImageIndex] ?? galleryImages[0];

  const goToPreviousImage = () => {
    setSelectedImageIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  };

  return (
    <main className={styles.page}>
      <section className={styles.detailSection}>
        <div className={styles.backLinkWrap}>
          <Link href="/" className={styles.backLink} aria-label="Volver al catálogo">
            ←
          </Link>
        </div>

        <div className={styles.detailImageWrap}>
          <div className={styles.carouselStage}>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={goToPreviousImage}
              aria-label="Imagen anterior"
            >
              ←
            </button>

            <img src={currentImage} alt={car.title} className={styles.detailImage} />

            <button
              type="button"
              className={styles.carouselButton}
              onClick={goToNextImage}
              aria-label="Imagen siguiente"
            >
              →
            </button>
          </div>

          {galleryImages.length > 1 && (
            <div className={styles.thumbnailStrip}>
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.thumbnailActive : ""}`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={image} alt={`${car.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.detailContent}>
          <p className={styles.sectionLabel}>Publicación seleccionada</p>
          <h2>{car.title}</h2>
          <div className={styles.detailInfoRow}>
            <span>{car.year}</span>
            <span>{car.km}</span>
            <span>{car.transmission}</span>
          </div>
          <p className={styles.detailPrice}>{car.price}</p>
          <p className={styles.detailDescription}>{car.description}</p>

          <div className={styles.detailSpecs}>
            <div>
              <span>Combustible</span>
              <strong>{car.fuel}</strong>
            </div>
            <div>
              <span>Transmisión</span>
              <strong>{car.transmission}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>{car.badge}</strong>
            </div>
          </div>

          <div className={styles.detailActions}>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hola, me interesa el auto ${car.title}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className={styles.whatsAppDetailButton}
            >
              <FaWhatsapp className={styles.whatsAppDetailIcon} />
              Consultar por WhatsApp
            </a>
            <Link href="/" className={styles.secondaryButton}>
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
