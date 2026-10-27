import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { AccountGate } from "@/components/account-gate";
import { PaletteStyle } from "@/components/palette-style";
import { SignInError } from "@/components/sign-in-error";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { HOME_TITLE, SITE_DESCRIPTION, SITE_NAME } from "@/lib/metadata";
import { publicSiteUrl } from "@/lib/site";
import { getPalettes } from "@/modules/appearance/repository";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Solo la usan algunos campos del admin: no se precarga en cada página.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

// Dirección base de las direcciones absolutas (canónicas, Open Graph),
// título con el nombre del sitio y vista al compartir un enlace. La imagen
// para compartir es opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl()),
  title: { default: HOME_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

// Color de la barra del navegador en el celular: el del encabezado.
export async function generateViewport(): Promise<Viewport> {
  const palettes = await getPalettes();
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: palettes.light.primary },
      { media: "(prefers-color-scheme: dark)", color: palettes.dark.primary },
    ],
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const palettes = await getPalettes();
  return (
    // next-themes agrega la clase .dark en el cliente: sin
    // suppressHydrationWarning React avisaría que la clase no coincide.
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Paleta guardada; si la base falla, la paleta base. */}
        <PaletteStyle palettes={palettes} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <SiteHeader />
          <Suspense fallback={null}>
            <SignInError />
          </Suspense>
          {/* Una cuenta suspendida no ve ninguna página. */}
          <Suspense fallback={null}>
            <AccountGate>{children}</AccountGate>
          </Suspense>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
