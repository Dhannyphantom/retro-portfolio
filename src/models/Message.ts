import mongoose, { Schema, models, model } from "mongoose";

const ReplySchema = new Schema(
  {
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    emailedOk: { type: Boolean, default: false },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["unread", "read", "archived"], default: "unread" },
    notes: { type: String },
    replies: [ReplySchema],
  },
  { timestamps: true }
);

export type MessageDoc = mongoose.InferSchemaType<typeof MessageSchema>;
export default models.Message || model("Message", MessageSchema);
