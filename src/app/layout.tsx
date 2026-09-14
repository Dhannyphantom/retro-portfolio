import type { Metadata } from "next";
import Script from "next/script";
import { Press_Start_2P, VT323, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteSettings } from "@/lib/settings";
import Providers from "@/lib/providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

// Retro-terminal type system used across the whole site: VT323 for display
// headings, Space Mono for body copy, Press Start 2P (small sizes only) for
// pixel labels/achievement toasts.
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-retro-pixel" });
const retroDisplay = VT323({ subsets: ["latin"], weight: "400", variable: "--font-retro-display" });
const retroBody = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-retro-body" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.name} — ${settings.title}`;

  // Social link-preview image (Open Graph / Twitter card) — uploaded via
  // /admin/profile. Omitted entirely when unset, so shares just fall back
  // to a plain title/description card instead of a broken image.
  const ogImages = settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined;

  // Favicon — uploaded via /admin/profile, svg or png. When unset, Next's
  // file-convention icon (src/app/icon.svg, the pixel-art avatar) is used
  // automatically, so `icons` is simply omitted here rather than pointing
  // at a hardcoded fallback path.
  const icons = settings.faviconUrl ? { icon: settings.faviconUrl, shortcut: settings.faviconUrl } : undefined;

  return {
    title,
    description: settings.bio,
    openGraph: { title, description: settings.bio, type: "website", images: ogImages },
    twitter: { card: "summary_large_image", title, description: settings.bio, images: ogImages },
    ...(icons ? { icons } : {}),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pixel.variable} ${retroDisplay.variable} ${retroBody.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body
        style={{ background: "var(--bg)", color: "var(--text)" }}
        className="min-h-screen relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
