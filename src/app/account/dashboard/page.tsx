import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUserSession } from "@/lib/userAuth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import LogoutButton from "./LogoutButton";

export default async function AccountDashboard() {
  const session = await getUserSession();
  if (!session) redirect("/account/login");

  await connectDB();
  const [userDoc, bookings] = await Promise.all([
    User.findById(session.userId).select("name email").lean(),
    Booking.find({ userId: session.userId }).sort({ createdAt: -1 }).lean(),
  ]);
  const user = userDoc as unknown as { name?: string; email?: string } | null;

  return (
    <div className="max-w-[900px] mx-auto px-7 pt-16 pb-24">
      <div className="flex justify-between items-start mb-10">
        <div>
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(0,229,255,0.42)" }}>YOUR PROJECTS</span>
          <h1 className="font-display text-[clamp(15px,2.2vw,19px)] tracking-tight mt-3 leading-relaxed">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        </div>
        <LogoutButton />
      </div>

      {bookings.length === 0 ? (
        <p className="text-mute">No projects yet. <Link href="/hire" className="text-violet">Submit a project brief</Link> to get started.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b: any) => (
            <Link
              key={b._id}
              href={`/account/projects/${b._id}`}
              className="hover-card flex items-center justify-between rounded-xl p-5"
              style={{ border: "1px solid rgba(217,214,232,0.09)", background: "#120A1F" }}
            >
              <div>
                <div className="font-display font-semibold text-lg mb-1">{b.projectType || "Project"}</div>
                <div className="text-mute text-[13px]">Ref {b.referenceId} · {b.status}</div>
              </div>
              <ArrowRight size={18} className="text-mute" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
