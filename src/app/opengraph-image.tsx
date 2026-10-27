import { ImageResponse } from "next/og";
import { SHARE_IMAGE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/metadata";

export const alt = SHARE_IMAGE.alt;
export const size = { width: SHARE_IMAGE.width, height: SHARE_IMAGE.height };
export const contentType = "image/png";

// Imagen al compartir un enlace del sitio (WhatsApp, redes). Se genera en el
// build, con los colores de la paleta base.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 24,
        padding: 80,
        background: "#171717",
        color: "#ffffff",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>{SITE_NAME}</div>
      <div style={{ fontSize: 44, maxWidth: 950, lineHeight: 1.2 }}>{SITE_DESCRIPTION}</div>
    </div>,
    size,
  );
}
