import mongoose, { Schema, models, model } from "mongoose";

const BookingSchema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
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
  },
  { timestamps: true }
);

export type BookingDoc = mongoose.InferSchemaType<typeof BookingSchema>;
export default models.Booking || model("Booking", BookingSchema);
