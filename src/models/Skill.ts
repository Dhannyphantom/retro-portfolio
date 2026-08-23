import mongoose, { Schema, models, model } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["Language", "Frontend", "Mobile", "Backend", "Database", "Cloud", "DevOps", "Tool"], required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SkillDoc = mongoose.InferSchemaType<typeof SkillSchema>;
export default models.Skill || model("Skill", SkillSchema);
