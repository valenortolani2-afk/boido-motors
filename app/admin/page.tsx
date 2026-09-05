"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  fallbackCarImage,
  generateCarId,
  type Car,
} from "../cars";
import { loadCatalogCars, persistCatalogCars } from "../../lib/catalog-client";
import styles from "../page.module.css";

type DraftCar = Omit<Car, "id"> & {
  images: string[];
};

const emptyCar: DraftCar = {
  title: "",
  year: "",
  price: "",
  image: "",
  images: [],
  badge: "",
  km: "",
  fuel: "",
  transmission: "",
  description: "",
};

const uploadDraftFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let payload: { urls?: string[]; error?: string } = {};
  try {
    payload = (await response.json()) as { urls?: string[]; error?: string };
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "Fallo al subir las imágenes");
  }

  const uploadedUrls = Array.isArray(payload.urls) ? payload.urls.filter(Boolean) : [];
  if (uploadedUrls.length > 0) {
    return uploadedUrls;
  }

  throw new Error("No se recibieron URLs de las imágenes");
};

export default function AdminCatalogPage() {
  const [catalog, setCatalog] = useState<Car[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftCar>(emptyCar);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const syncCatalog = () => {
      void loadCatalogCars().then((cars) => {
        if (!cancelled) setCatalog(cars);
      });
    };

    syncCatalog();
    window.addEventListener("boido-catalog-updated", syncCatalog);
    window.addEventListener("storage", syncCatalog);

    return () => {
      cancelled = true;
      window.removeEventListener("boido-catalog-updated", syncCatalog);
      window.removeEventListener("storage", syncCatalog);
    };
  }, []);

  const totalCars = useMemo(() => catalog.length, [catalog]);
  const draftImages = Array.isArray(draft?.images) ? draft.images : [];

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    try {
      const uploadedUrls = await uploadDraftFiles(files);

      if (!uploadedUrls.length) {
        throw new Error("No se recibieron URLs de las imágenes");
      }

      setDraft((current) => {
        const mergedImages = [...(Array.isArray(current.images) ? current.images : []), ...uploadedUrls].filter(Boolean);
        const safeImages = [...new Set(mergedImages.map((item) => item.trim()).filter(Boolean))];

        return {
          ...current,
          images: safeImages,
          image: current.image || safeImages[0] || fallbackCarImage,
        };
      });
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar algunas imágenes. Revisá la configuración de Vercel Blob y el token de producción."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setDraft((current) => {
      const updatedImages = current.images.filter((_, index) => index !== indexToRemove);
      const safeImages = [...new Set(updatedImages.map((item) => item.trim()).filter(Boolean))];

      return {
        ...current,
        images: safeImages,
        image: safeImages[0] || fallbackCarImage,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.title.trim()) return;

    const cleanedImages = [...new Set(draftImages.map((item) => item.trim()).filter(Boolean))];
    const normalizedDraft: Omit<Car, "id"> = {
      title: draft.title.trim(),
      year: draft.year.trim(),
      price: draft.price.trim(),
      image: cleanedImages[0] || draft.image.trim() || fallbackCarImage,
      images: cleanedImages.length > 0 ? cleanedImages : [fallbackCarImage],
      badge: draft.badge.trim(),
      km: draft.km.trim(),
      fuel: draft.fuel.trim(),
      transmission: draft.transmission.trim(),
      description: draft.description.trim(),
    };

    let nextCatalog: Car[];

    if (editingId !== null) {
      nextCatalog = catalog.map((car) =>
        car.id === editingId ? { ...car, ...normalizedDraft } : car
      );
    } else {
      const newId = generateCarId(catalog);
      nextCatalog = [{ id: newId, ...normalizedDraft }, ...catalog];
    }

    setSaving(true);
    try {
      const savedCatalog = await persistCatalogCars(nextCatalog);
      setCatalog(savedCatalog);
      setDraft(emptyCar);
      setEditingId(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "No se pudo guardar el catálogo.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingId(car.id);
    setDraft({
      title: car.title,
      year: car.year,
      price: car.price,
      image: car.image || fallbackCarImage,
      images: Array.isArray(car.images) && car.images.length > 0 ? car.images : car.image ? [car.image] : [fallbackCarImage],
      badge: car.badge,
      km: car.km,
      fuel: car.fuel,
      transmission: car.transmission,
      description: car.description,
    });
  };

  const handleDelete = async (carId: number) => {
    const car = catalog.find((item) => item.id === carId);
    if (!car || !window.confirm(`¿Eliminar la publicación "${car.title}"?`)) {
      return;
    }

    const nextCatalog = catalog.filter((car) => car.id !== carId);
    setSaving(true);
    try {
      const savedCatalog = await persistCatalogCars(nextCatalog);
      setCatalog(savedCatalog);

      if (editingId === carId) {
        setEditingId(null);
        setDraft(emptyCar);
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "No se pudo eliminar la publicación.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setDraft(emptyCar);
    setEditingId(null);
  };

  return (
    <main className={styles.adminPage}>
      <div className={styles.adminShell}>
        <header className={styles.adminHeader}>
          <div>
            <p className={styles.sectionLabel}>Panel de administración</p>
            <h1>Catálogo de autos</h1>
          </div>
          <Link href="/" className={styles.adminBackButton}>
            Volver a la web
          </Link>
        </header>

        <section className={styles.adminStats}>
          <div className={styles.adminStatCard}>
            <span>Total</span>
            <strong>{totalCars}</strong>
          </div>
          <div className={styles.adminStatCard}>
            <span>Publicaciones</span>
            <strong>{catalog.length}</strong>
          </div>
        </section>

        <section className={styles.adminFormCard}>
          <h2>{editingId !== null ? "Editar publicación" : "Nueva publicación"}</h2>

          <form onSubmit={handleSubmit} className={styles.adminForm}>
            <div className={styles.formGrid}>
              <label>
                Título
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  placeholder="Ej: BMW Serie 3"
                />
              </label>

              <label>
                Año
                <input
                  value={draft.year}
                  onChange={(event) => setDraft({ ...draft, year: event.target.value })}
                  placeholder="2022"
                />
              </label>

              <label>
                Precio
                <input
                  value={draft.price}
                  onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                  placeholder="$30.000"
                />
              </label>

              <label>
                Estado
                <input
                  value={draft.badge}
                  onChange={(event) => setDraft({ ...draft, badge: event.target.value })}
                  placeholder="Nuevo / Oferta"
                />
              </label>

              <label>
                Kilómetros
                <input
                  value={draft.km}
                  onChange={(event) => setDraft({ ...draft, km: event.target.value })}
                  placeholder="18.000 km"
                />
              </label>

              <label>
                Combustible
                <input
                  value={draft.fuel}
                  onChange={(event) => setDraft({ ...draft, fuel: event.target.value })}
                  placeholder="Nafta"
                />
              </label>

              <label>
                Transmisión
                <input
                  value={draft.transmission}
                  onChange={(event) => setDraft({ ...draft, transmission: event.target.value })}
                  placeholder="Automática"
                />
              </label>

              <label className={styles.fileInputLabel}>
                Imagenes
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
              </label>
            </div>

            {draftImages.length > 0 && (
              <div className={styles.photoGrid}>
                {draftImages.map((photo, index) => (
                  <div key={`${photo}-${index}`} className={styles.photoItem}>
                    <Image
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      fill
                      sizes="110px"
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                    <button type="button" onClick={() => handleRemoveImage(index)}>
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label>
              Descripción
              <textarea
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                rows={5}
                placeholder="Descripción del vehículo"
              />
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButtonAdmin} disabled={saving}>
                {saving ? "Guardando…" : editingId !== null ? "Guardar cambios" : "Crear publicación"}
              </button>
              <button type="button" className={styles.secondaryButtonAdmin} onClick={resetForm}>
                Limpiar
              </button>
            </div>
          </form>
        </section>

        <section className={styles.adminListCard}>
          <h2>Publicaciones actuales</h2>

          {catalog.length === 0 ? (
            <p className={styles.emptyState}>Todavía no hay publicaciones.</p>
          ) : (
            <div className={styles.adminList}>
              {catalog.map((car) => (
                <article key={car.id} className={styles.adminItem}>
                  <div className={styles.adminItemImageWrap}>
                    <Image
                      src={car.images?.[0] || car.image || fallbackCarImage}
                      alt={car.title}
                      fill
                      sizes="130px"
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className={styles.adminItemContent}>
                    <div className={styles.adminItemHeader}>
                      <h3>{car.title}</h3>
                      <span>{car.badge}</span>
                    </div>
                    <p>{car.price}</p>
                    <small>
                      {car.year} • {car.km} • {car.fuel}
                    </small>
                  </div>

                  <div className={styles.adminItemActions}>
                    <button type="button" onClick={() => handleEdit(car)}>
                      Editar
                    </button>
                    <button type="button" className={styles.adminDeleteButton} onClick={() => handleDelete(car.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
