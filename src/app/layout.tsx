import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import MatrixRain from "@/components/layout/MatrixRain";
import BootScreen from "@/components/layout/BootScreen";
import { getSiteSettings } from "@/lib/settings";

// Retro CRT-terminal type system: a pixel font for headers/labels (used
// sparingly — it's chunky, not for body copy) and JetBrains Mono for
// everything else, matching an actual monospaced terminal.
const display = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = JetBrains_Mono({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Dynamic — reads from the same Profile data managed at /admin/profile, so
// editing your name/title/bio there updates the browser tab title and social
// share previews too, not just the visible page content.
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body bg-ink text-paper min-h-screen relative overflow-x-hidden">
        <BootScreen name={settings.name} />
        <MatrixRain />
        <CustomCursor />
        <Nav name={settings.name} />
        <main className="relative z-10">{children}</main>
        <Footer name={settings.name} bio={settings.bio} email={settings.email} socials={settings.socials} />
      </body>
    </html>
  );
}
