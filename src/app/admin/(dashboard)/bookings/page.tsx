"use client";
import ResourceManager from "@/components/admin/ResourceManager";

export default function AdminBookings() {
  return (
    <ResourceManager
      collection="bookings"
      fields={[]}
      titleKey="referenceId"
      viewHref={(item) => `/admin/bookings/${item._id}`}
      hideCreate
      hideEdit
      title="Bookings"
    />
  );
}
