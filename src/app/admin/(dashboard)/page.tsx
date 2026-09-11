import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import Testimonial from "@/models/Testimonial";
import GlitchText from "@/components/retro/GlitchText";
import SectionLabel from "@/components/retro/SectionLabel";

async function getCounts() {
  try {
    await connectDB();
    const [projects, unreadMessages, newBookings, testimonials] = await Promise.all([
      Project.countDocuments(),
      Message.countDocuments({ status: "unread" }),
      Booking.countDocuments({ status: "New" }),
      Testimonial.countDocuments(),
    ]);
    return { projects, unreadMessages, newBookings, testimonials };
  } catch {
    return { projects: 0, unreadMessages: 0, newBookings: 0, testimonials: 0 };
  }
}

export default async function AdminOverview() {
  const counts = await getCounts();
  const cards = [
    { label: "projects", value: counts.projects, href: "/admin/projects" },
    { label: "unread messages", value: counts.unreadMessages, href: "/admin/messages" },
    { label: "new booking requests", value: counts.newBookings, href: "/admin/bookings" },
    { label: "testimonials", value: counts.testimonials, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <SectionLabel n="00" label="OVERVIEW" />
      <GlitchText tag="h1" style={{ fontFamily: "var(--font-retro-display)", fontSize: 36, color: "var(--text)", margin: "0 0 8px" }}>
        overview.
      </GlitchText>
      <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 12, color: "var(--text-dim)", marginBottom: 28 }}>
        A quick snapshot of what needs attention.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        {cards.map((c) => (
          <Link key={c.label} href={c.href} data-cursor-hover>
            <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "18px 20px" }}>
              <div style={{ fontFamily: "var(--font-retro-display)", fontSize: 30, color: "var(--g)" }}>{c.value}</div>
              <div style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", marginTop: 6 }}>{c.label}</div>
            </div>
          </Link>
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-retro-body)", fontSize: 11, color: "var(--text-dim)", lineHeight: 1.8, maxWidth: 560, marginTop: 32 }}>
        Use the sidebar to manage projects, review inbound messages and booking requests, curate
        testimonials, and update site-wide settings like your bio, socials and CV.
      </p>
    </div>
  );
}
