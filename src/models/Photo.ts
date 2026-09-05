import mongoose, { Schema, models, model } from "mongoose";

// Used by the "Meet the Developer" section's photo strip.
const PhotoSchema = new Schema(
  {
    src: { type: String, required: true },
    caption: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type PhotoDoc = mongoose.InferSchemaType<typeof PhotoSchema>;
export default models.Photo || model("Photo", PhotoSchema);
