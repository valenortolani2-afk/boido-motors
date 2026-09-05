/** ID de medición GA4. Solo se usa en producción. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-Y209PEQ1MV";

export const isGAEnabled =
  process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID.startsWith("G-");

type GtagCommand = "config" | "event" | "js" | "set";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: GtagCommand,
      targetId: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

function gtag(
  command: GtagCommand,
  targetId: string | Date,
  params?: Record<string, unknown>,
) {
  if (!isGAEnabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag(command, targetId, params);
}

export function pageview(url: string) {
  if (!isGAEnabled) return;
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function event(action: string, params?: Record<string, unknown>) {
  if (!isGAEnabled) return;
  gtag("event", action, params);
}
