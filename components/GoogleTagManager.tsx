"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GTM_ID, isGtmEnabled } from "../lib/gtm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function GtmPageView() {
  const pathname = usePathname();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}

export function GoogleTagManager() {
  if (!isGtmEnabled) {
    return null;
  }

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <GtmPageView />
    </>
  );
}

export function GoogleTagManagerNoscript() {
  if (!isGtmEnabled) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
