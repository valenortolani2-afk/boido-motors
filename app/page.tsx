"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { cars, whatsappBaseMessage, whatsappNumber } from "./cars";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <nav className={styles.topbar}>
          <div className={styles.brand}>AUTOCLUB</div>
          <div className={styles.navActions}>
            <a href="#catalogo">Catálogo</a>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappBaseMessage}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Venta directa • 0KM y usados</p>
          <h1 className={"titulo-principal"}>VENTA PERMUTA FINANCIACION DE AUTOS USADOS</h1>
          <p className={styles.heroText}>
            Encontrá el vehículo que se adapte a tu estilo, tu rutina y tu próxima aventura.
          </p>

          <div className={styles.heroButtons}>
            <a href="#catalogo" className={styles.primaryButton}>
              Ver catálogo
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappBaseMessage}`}
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
            <p>Nuevos y viejos</p>
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
              className={styles.card}
              onClick={() => router.push(`/car/${car.id}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/car/${car.id}`);
                }
              }}
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
                <Link href={`/car/${car.id}`} className={styles.cardButton}>
                  Ver publicación
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapHeader}>
          <p className={styles.sectionLabel}>Ubicación</p>
          <h2>Encontranos en Mar del Plata</h2>
        </div>

        <div className={styles.mapCard}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.34630961414!2d-57.583190225001495!3d-37.99238204426595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584d9373948c99f%3A0x5fa871aed0042c55!2sAlberti%205371%2C%20B7600%20Mar%20del%20Plata%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1788239386227!5m2!1ses-419!2sar"
            className={styles.mapFrame}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            title="Ubicación del negocio"
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>AUTOCLUB</div>
            <p>
              Venta de autos usados, financiamiento y atención personalizada para que encuentres
              el vehículo ideal con confianza.
            </p>
          </div>

          <div className={styles.footerColumn}>
            <h3>Navegación</h3>
            <ul>
              <li><a href="#catalogo">Catálogo</a></li>
              <li><a href={`https://wa.me/${whatsappNumber}?text=${whatsappBaseMessage}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3>Contacto</h3>
            <ul>
              <li><a href={`tel:${whatsappNumber}`}>+54 223 4060546</a></li>
              <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@fernandoboido?_r=1&_t=ZS-99MQAmgWEJU" target="_blank" rel="noreferrer">TikTok</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h3>Horarios</h3>
            <ul>
              <li>Lunes a Viernes</li>
              <li>09:00 - 17:00</li>
              <li>Sábados por cita</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 AUTOCLUB</span>
          <span>Todos los derechos reservados</span>
        </div>
      </footer>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappBaseMessage}`}
        target="_blank"
        rel="noreferrer"
        className={styles.floatingWhatsApp}
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className={styles.whatsappIcon} />
      </a>
    </main>
  );
}
