"use client";
import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { key: "name", label: "Name", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "message", label: "Message", type: "textarea" as const },
  { key: "status", label: "Status (unread / read / archived)", type: "text" as const },
  { key: "notes", label: "Internal notes", type: "textarea" as const },
];

export default function AdminMessages() {
  return <ResourceManager collection="messages" fields={FIELDS} titleKey="email" />;
}
