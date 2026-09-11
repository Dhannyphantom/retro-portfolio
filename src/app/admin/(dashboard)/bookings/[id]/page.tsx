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
    <div style={{ maxWidth: 720 }}>
      <Link href="/admin/bookings" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginBottom: 20 }} data-cursor-hover>
        <ArrowLeft size={14} /> all bookings
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
        <div>
          <span style={{ fontFamily: "var(--font-retro-body)", fontSize: 10, color: "var(--g)", letterSpacing: "0.1em" }}>{b.referenceId}</span>
          <h1 style={{ fontFamily: "var(--font-retro-display)", fontSize: 28, color: "var(--text)", margin: "6px 0 4px" }}>{b.name} — {b.projectType || "Project"}</h1>
          <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", margin: 0 }}>
            {b.email}{b.company ? ` · ${b.company}` : ""}{b.phone ? ` · ${b.phone}` : ""}
          </p>
        </div>
        <StatusEditor bookingId={b._id} status={b.status} />
      </div>

      <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: 18, marginBottom: 16, fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
        {b.description}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)", fontSize: 11 }}>
          {b.budget && <span>requested budget: <span style={{ color: "var(--text)" }}>{b.budget}</span></span>}
          {b.timeline && <span>requested timeline: <span style={{ color: "var(--text)" }}>{b.timeline}</span></span>}
          {b.preferredStartDate && <span>preferred start: <span style={{ color: "var(--text)" }}>{b.preferredStartDate}</span></span>}
        </div>
        {b.documentUrl && (
          <a href={b.documentUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, color: "var(--g)", fontSize: 11 }} data-cursor-hover>
            <FileText size={13} /> {b.documentName || "attached document"}
          </a>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <BudgetEditor bookingId={b._id} totalBudget={b.totalBudget} amountPaid={b.amountPaid} currency={b.currency} />
        <MilestoneEditor bookingId={b._id} milestones={b.milestones || []} />
      </div>

      <ThreadPanel bookingId={b._id} viewerRole="admin" />
    </div>
  );
}
