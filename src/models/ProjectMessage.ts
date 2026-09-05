import mongoose, { Schema, models, model } from "mongoose";

// A proposal is an optional structured payload a message can carry — the
// admin proposes budget/timeline/milestones, the client can approve it from
// their dashboard, which copies these values onto the parent Booking
// (see /api/threads/[bookingId]/approve).
const ProposalSchema = new Schema(
  {
    budget: { type: Number, required: true },
    timeline: { type: String, required: true },
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: String },
      },
    ],
  },
  { _id: false }
);

const ProjectMessageSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    senderRole: { type: String, enum: ["client", "admin"], required: true },
    senderName: { type: String, required: true },
    body: { type: String, required: true },
    proposal: { type: ProposalSchema },
    proposalStatus: { type: String, enum: ["pending", "approved", "declined"] }, // only set when `proposal` is present
    // Delivered is implicit (set the instant it's created); `readAt` is set
    // when the *other* party's thread view loads this message.
    readAt: { type: Date },
  },
  { timestamps: true }
);

export type ProjectMessageDoc = mongoose.InferSchemaType<typeof ProjectMessageSchema>;
export default models.ProjectMessage || model("ProjectMessage", ProjectMessageSchema);
