"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, MessageSquare, Star, CalendarCheck, User, LogOut, Cpu, FileEdit } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotifications";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content", label: "Content", icon: FileEdit },
  { href: "/admin/techstack", label: "Tech stack", icon: Cpu },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, notifKey: "messages" as const },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, notifKey: "bookings" as const },
  { href: "/admin/profile", label: "Profile", icon: User },
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
    <aside className="w-[220px] flex-shrink-0 border-r border-white/[0.08] min-h-screen p-5 hidden md:block">
      <div className="font-display font-bold text-lg mb-8 px-2">Admin</div>
      <nav className="flex flex-col gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          const count = countFor((l as any).notifKey);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="relative flex items-center gap-2.5 text-sm rounded px-3 py-2.5 transition-colors"
              style={{ color: active ? "#D9D6E8" : "#8A86A8", background: active ? "rgba(57,255,20,0.082)" : "transparent" }}
            >
              <span className="relative">
                <l.icon size={16} />
                {count > 0 && <span className="notif-dot" />}
              </span>
              {l.label}
              {count > 0 && <span className="ml-auto text-[11px] font-mono text-violet">{count}</span>}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="flex items-center gap-2.5 text-sm text-mute px-3 py-2.5 mt-8">
        <LogOut size={16} /> Log out
      </button>
    </aside>
  );
}
