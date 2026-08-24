"use client";
import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { key: "title", label: "Title", type: "text" as const },
  { key: "slug", label: "Slug (url-safe, unique)", type: "text" as const },
  { key: "category", label: "Category (Mobile / Web / Backend / SaaS / API / Other)", type: "text" as const },
  { key: "description", label: "Short description", type: "textarea" as const },
  { key: "longDescription", label: "Long description", type: "textarea" as const },
  { key: "thumbnail", label: "Thumbnail image URL", type: "text" as const },
  { key: "technologies", label: "Technologies", type: "list" as const },
  { key: "features", label: "Key features", type: "list" as const },
  { key: "role", label: "My role", type: "text" as const },
  { key: "challenges", label: "Challenges", type: "textarea" as const },
  { key: "solutions", label: "Solution", type: "textarea" as const },
  { key: "results", label: "Results", type: "textarea" as const },
  { key: "liveUrl", label: "Live URL", type: "text" as const },
  { key: "githubUrl", label: "GitHub URL", type: "text" as const },
  { key: "featured", label: "Featured", type: "boolean" as const },
  { key: "order", label: "Order", type: "number" as const },
];

export default function AdminProjects() {
  return <ResourceManager collection="projects" fields={FIELDS} titleKey="title" />;
}
