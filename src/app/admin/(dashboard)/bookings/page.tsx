"use client";
import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { key: "name", label: "Name", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "projectType", label: "Project type", type: "text" as const },
  { key: "description", label: "Description", type: "textarea" as const },
  { key: "budget", label: "Budget", type: "text" as const },
  { key: "timeline", label: "Timeline", type: "text" as const },
  { key: "status", label: "Status (New / Contacted / In Discussion / Proposal Sent / Won / Lost / Archived)", type: "text" as const },
  { key: "internalNotes", label: "Internal notes", type: "textarea" as const },
];

export default function AdminBookings() {
  return <ResourceManager collection="bookings" fields={FIELDS} titleKey="referenceId" viewHref={(item) => `/admin/bookings/${item._id}`} />;
}
