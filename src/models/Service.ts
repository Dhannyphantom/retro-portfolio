import mongoose, { Schema, models, model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Code2" },
    startingPrice: { type: String },
    timeline: { type: String },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ServiceDoc = mongoose.InferSchemaType<typeof ServiceSchema>;
export default models.Service || model("Service", ServiceSchema);
