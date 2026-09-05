export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-M3TMQFCR";

export const isGtmEnabled =
  process.env.NODE_ENV === "production" && GTM_ID.startsWith("GTM-");
