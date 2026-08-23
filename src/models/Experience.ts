import mongoose, { Schema, models, model } from "mongoose";

const ExperienceSchema = new Schema(
  {
    role: { type: String, required: true },
    organization: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "Present" },
    description: { type: String },
    achievements: [{ type: String }],
    technologies: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ExperienceDoc = mongoose.InferSchemaType<typeof ExperienceSchema>;
export default models.Experience || model("Experience", ExperienceSchema);
