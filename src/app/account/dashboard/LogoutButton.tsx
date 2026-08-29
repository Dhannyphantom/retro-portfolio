"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/account/login");
    router.refresh();
  };
  return (
    <button onClick={logout} className="inline-flex items-center gap-1.5 text-mute text-[13px]">
      <LogOut size={14} /> Log out
    </button>
  );
}
