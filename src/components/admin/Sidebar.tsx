"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, MessageSquare, Star, CalendarCheck, Settings, LogOut } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-[220px] flex-shrink-0 border-r border-white/[0.08] min-h-screen p-5 hidden md:block">
      <div className="font-display font-bold text-lg mb-8 px-2">Admin</div>
      <nav className="flex flex-col gap-1">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 text-sm rounded px-3 py-2.5 transition-colors"
              style={{ color: active ? "#F3F0F7" : "#A79FB8", background: active ? "rgba(139,47,224,0.082)" : "transparent" }}
            >
              <l.icon size={16} /> {l.label}
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
