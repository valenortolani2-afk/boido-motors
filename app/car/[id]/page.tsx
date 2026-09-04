"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { fallbackCarImage, getCarPrimaryImage, type Car, whatsappNumber } from "../../cars";
import { loadCatalogCars } from "../../../lib/catalog-client";
import styles from "../../page.module.css";

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [car, setCar] = useState<Car | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadCatalogCars().then((cars) => {
      if (cancelled) return;
      setCar(cars.find((item) => item.id === Number(params.id)) ?? null);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (!loaded) {
    return (
      <main className={styles.page}>
        <section className={styles.detailSection}>
          <p className={styles.emptyState}>Cargando publicación…</p>
        </section>
      </main>
    );
  }

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

  const galleryImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : [getCarPrimaryImage(car)];
  const currentImage = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? fallbackCarImage;

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

            <Image
              src={currentImage || fallbackCarImage}
              alt={car.title}
              className={styles.detailImage}
              width={1200}
              height={900}
              unoptimized
              priority
            />

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
                  <Image src={image} alt={`${car.title} ${index + 1}`} width={200} height={120} unoptimized />
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
