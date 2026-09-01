import Link from "next/link";
import { notFound } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { cars, whatsappNumber } from "../../cars";
import styles from "../../page.module.css";

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = cars.find((item) => item.id === Number(id));

  if (!car) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={styles.detailSection}>
        <div className={styles.backLinkWrap}>
          <Link href="/" className={styles.backLink} aria-label="Volver al catálogo">
            ←
          </Link>
        </div>

        <div className={styles.detailImageWrap}>
          <img src={car.image} alt={car.title} className={styles.detailImage} />
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
