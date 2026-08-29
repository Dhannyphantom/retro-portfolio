import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ThreadPanel from "@/components/account/ThreadPanel";
import MilestoneEditor from "./MilestoneEditor";
import BudgetEditor from "./BudgetEditor";

export default async function AdminBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  await connectDB();
  const booking = await Booking.findById(id).lean();
  if (!booking) notFound();

  const b = JSON.parse(JSON.stringify(booking));

  return (
    <div>
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-mute text-sm mb-6 hover:text-paper transition-colors">
        <ArrowLeft size={15} /> All bookings
      </Link>

      <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
        <div>
          <span className="font-mono text-xs tracking-widest text-violet">{b.referenceId}</span>
          <h1 className="font-display font-bold text-2xl tracking-tight mt-2">{b.name} — {b.projectType || "Project"}</h1>
          <p className="text-mute text-sm mt-1">{b.email}{b.company ? ` · ${b.company}` : ""}</p>
        </div>
        <span className="text-[12px] font-mono px-3 py-1.5 rounded" style={{ color: "#B45CFF", background: "rgba(139,47,224,0.08)", border: "1px solid rgba(180,92,255,0.24)" }}>{b.status}</span>
      </div>

      <div className="rounded-xl p-5 mb-8 text-sm text-mute leading-relaxed" style={{ border: "1px solid rgba(243,240,247,0.09)", background: "#131115" }}>
        {b.description}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <BudgetEditor bookingId={b._id} totalBudget={b.totalBudget} amountPaid={b.amountPaid} />
          <MilestoneEditor bookingId={b._id} milestones={b.milestones || []} />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg mb-4">Conversation</h2>
          <p className="text-mute text-[13px] mb-4">Negotiate scope here — use the proposal button to send budget/timeline/milestones for the client to approve.</p>
          <ThreadPanel bookingId={b._id} viewerRole="admin" />
        </div>
      </div>
    </div>
  );
}
