import mongoose, { Schema, models, model } from "mongoose";

const RateCardSchema = new Schema(
  {
    name: { type: String, required: true },
    billingType: { type: String, enum: ["hourly", "project", "retainer"], required: true },
    price: { type: String, required: true },
    unit: { type: String },
    description: { type: String },
    features: [{ type: String }],
    recommended: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type RateCardDoc = mongoose.InferSchemaType<typeof RateCardSchema>;
export default models.RateCard || model("RateCard", RateCardSchema);
