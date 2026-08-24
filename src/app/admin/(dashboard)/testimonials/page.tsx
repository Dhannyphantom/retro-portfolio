"use client";
import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { key: "clientName", label: "Client name", type: "text" as const },
  { key: "position", label: "Position", type: "text" as const },
  { key: "company", label: "Company", type: "text" as const },
  { key: "avatar", label: "Avatar image URL", type: "text" as const },
  { key: "quote", label: "Quote", type: "textarea" as const },
  { key: "rating", label: "Rating (1-5)", type: "number" as const },
  { key: "project", label: "Related project", type: "text" as const },
  { key: "featured", label: "Featured", type: "boolean" as const },
  { key: "approved", label: "Approved (shows on site)", type: "boolean" as const },
];

export default function AdminTestimonials() {
  return <ResourceManager collection="testimonials" fields={FIELDS} titleKey="clientName" />;
}
