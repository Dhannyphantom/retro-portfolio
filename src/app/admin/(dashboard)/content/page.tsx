"use client";
import { useState } from "react";
import ResourceManager from "@/components/admin/ResourceManager";

const TABS = [
  {
    key: "experience", label: "Experience", titleKey: "role",
    fields: [
      { key: "role", label: "Role", type: "text" as const },
      { key: "organization", label: "Organization", type: "text" as const },
      { key: "startDate", label: "Start date", type: "text" as const },
      { key: "endDate", label: "End date", type: "text" as const },
      { key: "description", label: "Description", type: "textarea" as const },
      { key: "technologies", label: "Technologies", type: "list" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "services", label: "Services", titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" as const },
      { key: "description", label: "Description", type: "textarea" as const },
      { key: "icon", label: "Icon (lucide-react name, e.g. Smartphone)", type: "text" as const },
      { key: "startingPrice", label: "Starting price", type: "text" as const },
      { key: "timeline", label: "Timeline", type: "text" as const },
      { key: "features", label: "Features", type: "list" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "ratecards", label: "Rate cards", titleKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text" as const },
      { key: "billingType", label: "Billing type (hourly / project / retainer)", type: "text" as const },
      { key: "price", label: "Price", type: "text" as const },
      { key: "unit", label: "Unit (e.g. / hour, starting at)", type: "text" as const },
      { key: "description", label: "Description", type: "textarea" as const },
      { key: "features", label: "Features", type: "list" as const },
      { key: "recommended", label: "Recommended", type: "boolean" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "stats", label: "Dev stats", titleKey: "label",
    fields: [
      { key: "icon", label: "Icon (lucide-react name, e.g. Award)", type: "text" as const },
      { key: "value", label: "Value", type: "number" as const },
      { key: "suffix", label: "Suffix (e.g. +, %)", type: "text" as const },
      { key: "label", label: "Label", type: "text" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "workflowsteps", label: "How I work", titleKey: "title",
    fields: [
      { key: "icon", label: "Icon (lucide-react name, e.g. Search)", type: "text" as const },
      { key: "title", label: "Title", type: "text" as const },
      { key: "description", label: "Description", type: "text" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "philosophylines", label: "Philosophy", titleKey: "text",
    fields: [
      { key: "text", label: "Line", type: "text" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "faqs", label: "FAQs", titleKey: "question",
    fields: [
      { key: "question", label: "Question", type: "text" as const },
      { key: "answer", label: "Answer", type: "textarea" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "photos", label: "Meet-the-dev photos", titleKey: "caption",
    fields: [
      { key: "src", label: "Image URL", type: "text" as const },
      { key: "caption", label: "Caption", type: "text" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "projectvideos", label: "Meet-the-dev videos", titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" as const },
      { key: "duration", label: "Duration (e.g. 1:24)", type: "text" as const },
      { key: "thumb", label: "Thumbnail image URL", type: "text" as const },
      { key: "src", label: "Video file URL", type: "text" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
  {
    key: "skills", label: "Skills", titleKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text" as const },
      { key: "category", label: "Category (Language/Frontend/Mobile/Backend/Database/Cloud/DevOps/Tool)", type: "text" as const },
      { key: "order", label: "Order", type: "number" as const },
    ],
  },
];

export default function AdminContent() {
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <div>
      <h1 className="font-display text-[16px] mb-3 leading-relaxed">Content</h1>
      <p className="text-mute text-sm mb-6">
        Every homepage section — experience, services, rate cards, stats, workflow, philosophy,
        FAQs, and the &quot;meet the developer&quot; photos/videos — lives here, editable without
        touching code. (Projects, testimonials, and tech stack have their own pages in the sidebar.)
      </p>

      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-white/[0.08] pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className="text-[12.5px] px-3 py-1.5 rounded-full"
            style={{
              color: active === t.key ? "#0A0118" : "#8A86A8",
              background: active === t.key ? "#D9D6E8" : "rgba(217,214,232,0.05)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ResourceManager key={tab.key} collection={tab.key} fields={tab.fields} titleKey={tab.titleKey} title={tab.label} />
    </div>
  );
}
