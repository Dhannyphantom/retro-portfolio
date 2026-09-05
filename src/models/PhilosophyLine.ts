import mongoose, { Schema, models, model } from "mongoose";

const PhilosophyLineSchema = new Schema(
  {
    text: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type PhilosophyLineDoc = mongoose.InferSchemaType<typeof PhilosophyLineSchema>;
export default models.PhilosophyLine || model("PhilosophyLine", PhilosophyLineSchema);
