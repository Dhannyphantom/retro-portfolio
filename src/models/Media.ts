import mongoose, { Schema, models, model } from "mongoose";

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    filename: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    alt: { type: String },
  },
  { timestamps: true }
);

export type MediaDoc = mongoose.InferSchemaType<typeof MediaSchema>;
export default models.Media || model("Media", MediaSchema);
