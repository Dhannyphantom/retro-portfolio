import mongoose, { Schema, models, model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type FAQDoc = mongoose.InferSchemaType<typeof FAQSchema>;
export default models.FAQ || model("FAQ", FAQSchema);
