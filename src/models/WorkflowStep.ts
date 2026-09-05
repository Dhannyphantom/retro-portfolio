import mongoose, { Schema, models, model } from "mongoose";

const WorkflowStepSchema = new Schema(
  {
    icon: { type: String, default: "Search" }, // lucide-react icon name
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type WorkflowStepDoc = mongoose.InferSchemaType<typeof WorkflowStepSchema>;
export default models.WorkflowStep || model("WorkflowStep", WorkflowStepSchema);
