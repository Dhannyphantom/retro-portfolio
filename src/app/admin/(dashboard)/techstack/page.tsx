"use client";
import ResourceManager from "@/components/admin/ResourceManager";

const FIELDS = [
  { key: "name", label: "Name (e.g. React Native)", type: "text" as const },
  { key: "iconUrl", label: "Icon URL — try https://cdn.simpleicons.org/<slug>", type: "text" as const },
  { key: "showInHero", label: "Show in hero orbit (max 3 used)", type: "boolean" as const },
  { key: "showInMarquee", label: "Show in marquee strip", type: "boolean" as const },
  { key: "order", label: "Order", type: "number" as const },
];

export default function AdminTechStack() {
  return <ResourceManager collection="techstack" fields={FIELDS} titleKey="name" />;
}
