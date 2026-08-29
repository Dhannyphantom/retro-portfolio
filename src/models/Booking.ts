import mongoose, { Schema, models, model } from "mongoose";

function randomRef() {
  return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const MilestoneSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    media: [{ type: String }], // image/video URLs
  },
  { _id: true }
);

const BookingSchema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true, default: randomRef },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    phone: { type: String },
    projectType: { type: String },
    budget: { type: String },
    timeline: { type: String },
    description: { type: String, required: true },
    servicesNeeded: [{ type: String }],
    preferredContact: { type: String },
    preferredStartDate: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Discussion", "Proposal Sent", "Won", "Lost", "Archived"],
      default: "New",
    },
    internalNotes: { type: String },
    // Set once a proposal is approved through the client dashboard/thread —
    // see /api/threads/[bookingId]/approve.
    totalBudget: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    approvedTimeline: { type: String },
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
);

export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema>;
export default models.Booking || model("Booking", BookingSchema);
