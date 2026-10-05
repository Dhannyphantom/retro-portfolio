import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Press_Start_2P, VT323, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteSettings } from "@/lib/settings";
import Providers from "@/lib/providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { getSiteUrl, DEFAULT_OG_PATH } from "@/lib/seo";

export const dynamic = "force-dynamic";

const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-retro-pixel" });
const retroDisplay = VT323({ subsets: ["latin"], weight: "400", variable: "--font-retro-display" });
const retroBody = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-retro-body" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080808" },
    { media: "(prefers-color-scheme: light)", color: "#f0ece0" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();
  const defaultTitle = `${settings.name} — ${settings.title}`;
  const ogImage = settings.ogImageUrl || DEFAULT_OG_PATH;
  const icons = settings.faviconUrl ? { icon: settings.faviconUrl, shortcut: settings.faviconUrl } : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: defaultTitle, template: `%s | ${settings.name}` },
    description: settings.bio,
    applicationName: settings.name,
    authors: [{ name: settings.name, url: siteUrl }],
    creator: settings.name,
    publisher: settings.name,
    category: "technology",
    keywords: [
      settings.name,
      settings.title,
      "software developer",
      "React Native developer",
      "Next.js developer",
      "Node.js developer",
      "full-stack developer",
      "mobile app developer",
      "hire developer",
    ],
    // "./" resolves to each page's own URL, giving every route a self-referencing canonical.
    alternates: { canonical: "./" },
    openGraph: {
      title: defaultTitle,
      description: settings.bio,
      url: siteUrl,
      siteName: settings.name,
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description: settings.bio, images: [ogImage] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    // Google Search Console "HTML tag" method: set GOOGLE_SITE_VERIFICATION to the content value only.
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    formatDetection: { telephone: false, email: false, address: false },
    ...(icons ? { icons } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pixel.variable} ${retroDisplay.variable} ${retroBody.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body style={{ background: "var(--bg)", color: "var(--text)" }} className="min-h-screen relative overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
