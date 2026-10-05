import type { Metadata } from "next";
import RetroAdminShell from "@/components/retro/RetroAdminShell";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <RetroAdminShell>
      <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </RetroAdminShell>
  );
}
