import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import RetroAdminShell from "@/components/retro/RetroAdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page itself renders without the sidebar/guard — everything
  // else under /admin requires a valid session cookie.
  if (!session) redirect("/admin/login");

  return (
    <RetroAdminShell>
      <Sidebar />
      <div style={{ flex: 1, padding: "32px 24px 80px", maxWidth: 1100, position: "relative", zIndex: 1 }}>{children}</div>
    </RetroAdminShell>
  );
}
