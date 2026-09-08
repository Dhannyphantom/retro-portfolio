import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ThreadPanel from "@/components/account/ThreadPanel";
import MilestoneEditor from "./MilestoneEditor";
import BudgetEditor from "./BudgetEditor";
import StatusEditor from "./StatusEditor";

export default async function AdminBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  await connectDB();
  const booking = await Booking.findById(id).lean();
  if (!booking) notFound();

  const b = JSON.parse(JSON.stringify(booking));

  return (
    <div className="max-w-[720px]">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-mute text-sm mb-6 hover:text-paper transition-colors">
        <ArrowLeft size={15} /> All bookings
      </Link>

      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <span className="font-mono text-xs tracking-widest text-violet">{b.referenceId}</span>
          <h1 className="font-display text-[15px] tracking-tight mt-3 leading-relaxed">{b.name} — {b.projectType || "Project"}</h1>
          <p className="text-mute text-sm mt-1">{b.email}{b.company ? ` · ${b.company}` : ""}{b.phone ? ` · ${b.phone}` : ""}</p>
        </div>
        <StatusEditor bookingId={b._id} status={b.status} />
      </div>

      {/* read-only — this is exactly what the client submitted */}
      <div className="rounded-xl p-5 mb-4 text-sm text-mute leading-relaxed" style={{ border: "1px solid rgba(var(--text-rgb),0.09)", background: "var(--panel)" }}>
        {b.description}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/[0.07] text-[12.5px]">
          {b.budget && <span>Requested budget: <span className="text-paper">{b.budget}</span></span>}
          {b.timeline && <span>Requested timeline: <span className="text-paper">{b.timeline}</span></span>}
          {b.preferredStartDate && <span>Preferred start: <span className="text-paper">{b.preferredStartDate}</span></span>}
        </div>
        {b.documentUrl && (
          <a href={b.documentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-violet text-[12.5px]">
            <FileText size={13} /> {b.documentName || "Attached document"}
          </a>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <BudgetEditor bookingId={b._id} totalBudget={b.totalBudget} amountPaid={b.amountPaid} currency={b.currency} />
        <MilestoneEditor bookingId={b._id} milestones={b.milestones || []} />
      </div>

      <ThreadPanel bookingId={b._id} viewerRole="admin" />
    </div>
  );
}
