import mongoose, { Schema, models, model } from "mongoose";

const StatSchema = new Schema(
  {
    icon: { type: String, default: "Award" }, // lucide-react icon name
    value: { type: Number, required: true },
    suffix: { type: String, default: "+" },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type StatDoc = mongoose.InferSchemaType<typeof StatSchema>;
export default models.Stat || model("Stat", StatSchema);
