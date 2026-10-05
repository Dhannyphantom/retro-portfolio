import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import RetroAdminShell from "@/components/retro/RetroAdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <RetroAdminShell>
      <Sidebar />
      <div style={{ flex: 1, padding: "32px 24px 80px", maxWidth: 1100, position: "relative", zIndex: 1 }}>{children}</div>
    </RetroAdminShell>
  );
}
