import RetroAdminShell from "@/components/retro/RetroAdminShell";

// Overrides the parent admin layout's auth guard — the login page must be reachable when logged out.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <RetroAdminShell>
      <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </RetroAdminShell>
  );
}
