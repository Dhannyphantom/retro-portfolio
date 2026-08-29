import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserSession } from "@/lib/userAuth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import ThreadPanel from "@/components/account/ThreadPanel";
import SafeImage from "@/components/ui/SafeImage";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getUserSession();
  if (!session) redirect("/account/login");

  await connectDB();
  const booking = await Booking.findById(id).lean();
  if (!booking || String((booking as any).userId) !== session.userId) notFound();

  const b = booking as any;
  const outstanding = Math.max((b.totalBudget || 0) - (b.amountPaid || 0), 0);
  const progressPct = b.totalBudget ? Math.min(Math.round(((b.amountPaid || 0) / b.totalBudget) * 100), 100) : 0;

  return (
    <div className="max-w-[1000px] mx-auto px-7 pt-14 pb-24">
      <Link href="/account/dashboard" className="inline-flex items-center gap-1.5 text-mute text-sm mb-7 hover:text-paper transition-colors">
        <ArrowLeft size={15} /> All projects
      </Link>

      <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
        <div>
          <span className="font-mono text-xs tracking-widest" style={{ color: "rgba(180,92,255,0.42)" }}>{b.referenceId}</span>
          <h1 className="font-display font-bold text-[clamp(26px,3.4vw,36px)] tracking-tight mt-2">{b.projectType || "Project"}</h1>
        </div>
        <span className="text-[12px] font-mono px-3 py-1.5 rounded" style={{ color: "#B45CFF", background: "rgba(139,47,224,0.08)", border: "1px solid rgba(180,92,255,0.24)" }}>{b.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="rounded-xl p-5" style={{ border: "1px solid rgba(243,240,247,0.09)", background: "#131115" }}>
          <div className="text-mute text-[12.5px] mb-1.5">Total budget</div>
          <div className="font-display font-bold text-2xl">{b.totalBudget ? `$${b.totalBudget.toLocaleString()}` : "Not yet agreed"}</div>
        </div>
        <div className="rounded-xl p-5" style={{ border: "1px solid rgba(243,240,247,0.09)", background: "#131115" }}>
          <div className="text-mute text-[12.5px] mb-1.5">Paid so far</div>
          <div className="font-display font-bold text-2xl">${(b.amountPaid || 0).toLocaleString()}</div>
        </div>
        <div className="rounded-xl p-5" style={{ border: "1px solid rgba(243,240,247,0.09)", background: "#131115" }}>
          <div className="text-mute text-[12.5px] mb-1.5">Outstanding</div>
          <div className="font-display font-bold text-2xl">${outstanding.toLocaleString()}</div>
        </div>
      </div>

      {b.totalBudget > 0 && (
        <div className="mb-10">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(243,240,247,0.08)" }}>
            <div className="h-full rounded-full bg-gradient-to-r from-violet to-purple" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-mute text-[12px] mt-1.5">{progressPct}% paid</div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="font-display font-semibold text-lg mb-4">Timeline & milestones</h2>
        {b.approvedTimeline && <p className="text-mute text-sm mb-4">Agreed timeline: <span className="text-paper">{b.approvedTimeline}</span></p>}
        {!b.milestones?.length ? (
          <p className="text-mute text-sm">No milestones set yet — these appear once a proposal is approved in the conversation below.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {b.milestones.map((m: any, i: number) => (
              <div key={i} className="rounded-xl p-4" style={{ border: "1px solid rgba(243,240,247,0.09)", background: "#131115" }}>
                <div className="flex justify-between items-start gap-3 mb-1.5">
                  <div className="font-medium text-[14.5px]">{m.title}</div>
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded flex-shrink-0"
                    style={{
                      color: m.status === "completed" ? "#8FE3A6" : m.status === "in-progress" ? "#B45CFF" : "#A79FB8",
                      background: m.status === "completed" ? "rgba(143,227,166,0.1)" : m.status === "in-progress" ? "rgba(139,47,224,0.1)" : "rgba(243,240,247,0.06)",
                    }}
                  >
                    {m.status}
                  </span>
                </div>
                {m.description && <p className="text-mute text-[13px] mb-2">{m.description}</p>}
                {m.dueDate && <p className="text-mute text-[12px] mb-2">Due {m.dueDate}</p>}
                {!!m.media?.length && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {m.media.map((url: string, mi: number) => (
                      <SafeImage key={mi} src={url} className="w-20 h-20 rounded-lg object-cover" iconSize={18} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Conversation</h2>
        <p className="text-mute text-[13px] mb-4">Discuss scope, budget and timeline here — when we agree on terms, I&apos;ll send a proposal you can approve, which updates everything above automatically.</p>
        <ThreadPanel bookingId={b._id.toString()} viewerRole="client" />
      </div>
    </div>
  );
}
