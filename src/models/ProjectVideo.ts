import mongoose, { Schema, models, model } from "mongoose";

// Used by the "Meet the Developer" section's video cards — distinct from
// per-milestone media (Booking.milestones[].media), which is project-specific.
const ProjectVideoSchema = new Schema(
  {
    title: { type: String, required: true },
    duration: { type: String },
    thumb: { type: String, required: true },
    src: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectVideoDoc = mongoose.InferSchemaType<typeof ProjectVideoSchema>;
export default models.ProjectVideo || model("ProjectVideo", ProjectVideoSchema);
