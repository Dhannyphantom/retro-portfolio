import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Message from "@/models/Message";
import Booking from "@/models/Booking";
import Testimonial from "@/models/Testimonial";

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
    { label: "Projects", value: counts.projects, href: "/admin/projects" },
    { label: "Unread messages", value: counts.unreadMessages, href: "/admin/messages" },
    { label: "New booking requests", value: counts.newBookings, href: "/admin/bookings" },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="font-display text-[16px] mb-3 leading-relaxed">Overview</h1>
      <p className="text-mute text-sm mb-8">A quick snapshot of what needs attention.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="hover-card rounded-xl p-5 bg-ink2 block" style={{ border: "1px solid rgba(217,214,232,0.09)" }}>
            <div className="font-display text-[17px] leading-relaxed">{c.value}</div>
            <div className="text-mute text-[13px] mt-1.5">{c.label}</div>
          </a>
        ))}
      </div>
      <div className="mt-10 text-mute text-sm leading-relaxed max-w-[560px]">
        Use the sidebar to manage projects, review inbound messages and booking requests, curate
        testimonials, and update site-wide settings like your bio, socials and CV.
      </div>
    </div>
  );
}
