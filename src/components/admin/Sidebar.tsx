"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, MessageSquare, Star, CalendarCheck, User, LogOut, Cpu, FileEdit } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotifications";

const LINKS = [
  { href: "/admin", label: "overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "projects", icon: FolderKanban },
  { href: "/admin/bookings", label: "bookings", icon: CalendarCheck, notifKey: "bookings" as const },
  { href: "/admin/content", label: "content", icon: FileEdit },
  { href: "/admin/techstack", label: "tech stack", icon: Cpu },
  { href: "/admin/messages", label: "messages", icon: MessageSquare, notifKey: "messages" as const },
  { href: "/admin/testimonials", label: "testimonials", icon: Star },
  { href: "/admin/profile", label: "profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const notifs = useNotifications();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const countFor = (key?: "messages" | "bookings") => {
    if (!key || !notifs) return 0;
    if (key === "messages") return Number(notifs.messages || 0);
    return Number(notifs.bookings || 0) + Number(notifs.threads || 0);
  };

  return (
    <aside
      className="hidden md:flex"
      style={{
        width: 220, flexShrink: 0, minHeight: "100vh", flexDirection: "column",
        borderRight: "1px solid var(--border)", background: "var(--bg2)", padding: "20px 14px",
        position: "relative", zIndex: 1,
      }}
    >
      <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 22, color: "var(--text)", marginBottom: 20, padding: "0 8px" }}>
        admin/
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {LINKS.map((l) => {
          const active = pathname === l.href;
          const count = countFor((l as any).notifKey);
          return (
            <Link
              key={l.href}
              href={l.href}
              data-cursor-hover
              style={{
                position: "relative", display: "flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-retro-body)", fontSize: 12, padding: "9px 10px",
                color: active ? "var(--text)" : "var(--text-dim)",
                background: active ? "var(--bg3)" : "transparent",
                borderLeft: active ? "2px solid var(--g)" : "2px solid transparent",
              }}
            >
              <span style={{ position: "relative", display: "inline-flex" }}>
                <l.icon size={14} />
                {count > 0 && <span style={{ position: "absolute", top: -3, right: -3, width: 6, height: 6, borderRadius: "50%", background: "var(--r)" }} />}
              </span>
              {l.label}
              {count > 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--g)" }}>{count}</span>}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        data-cursor-hover
        style={{
          display: "flex", alignItems: "center", gap: 10, marginTop: "auto", padding: "9px 10px",
          fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)",
          background: "none", border: "none", cursor: "none", textAlign: "left",
        }}
      >
        <LogOut size={14} /> log out
      </button>
    </aside>
  );
}
