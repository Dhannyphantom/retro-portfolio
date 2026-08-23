import mongoose, { Schema, models, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, enum: ["Mobile", "Web", "Backend", "SaaS", "API", "Other"], default: "Web" },
    description: { type: String, required: true },
    longDescription: { type: String },
    thumbnail: { type: String },
    gallery: [{ type: String }],
    videoUrl: { type: String },
    technologies: [{ type: String }],
    client: { type: String },
    role: { type: String },
    features: [{ type: String }],
    challenges: { type: String },
    solutions: { type: String },
    results: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectDoc = mongoose.InferSchemaType<typeof ProjectSchema>;
export default models.Project || model("Project", ProjectSchema);
