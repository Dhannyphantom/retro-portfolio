import type { Metadata } from "next";
import Script from "next/script";
import { Press_Start_2P, JetBrains_Mono, VT323, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteSettings } from "@/lib/settings";
import Providers from "@/lib/providers";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

// Legacy type system (still used by pages not yet migrated to the retro UI).
const display = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const body = JetBrains_Mono({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Retro-terminal type system (new homepage). Press Start 2P is shared with
// the legacy pixel font above via --font-retro-pixel so it isn't loaded
// twice.
const retroDisplay = VT323({ subsets: ["latin"], weight: "400", variable: "--font-retro-display" });
const retroBody = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-retro-body" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.name} — ${settings.title}`;
  return {
    title,
    description: settings.bio,
    openGraph: { title, description: settings.bio, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} ${retroDisplay.variable} ${retroBody.variable}`}
      style={{ "--font-retro-pixel": "var(--font-display)" } as React.CSSProperties}
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
        className="font-body bg-ink text-paper min-h-screen relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <SiteChrome name={settings.name} bio={settings.bio} email={settings.email} socials={settings.socials}>
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
