import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page itself renders without the sidebar/guard — everything
  // else under /admin requires a valid session cookie.
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 sm:p-10 max-w-[1000px]">{children}</div>
    </div>
  );
}
