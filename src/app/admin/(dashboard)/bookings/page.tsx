"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function AdminBookings() {
  return (
    <ResourceManager
      collection="bookings"
      fields={[]}
      // A bare reference id ("BK-XXXX") told the admin nothing at a glance —
      // show who it's from and what kind of project it is instead. The
      // reference id still shows up in the subtitle line (via ResourceManager's
      // generic preview logic) and on the detail page itself.
      titleKey={(item) => `${item.name || "Unknown"} — ${item.projectType || "Project"}`}
      viewHref={(item) => `/admin/bookings/${item._id}`}
      hideCreate
      hideEdit
      title="Bookings"
    />
  );
}
