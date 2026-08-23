import mongoose, { Schema, models, model } from "mongoose";

// Singleton document — always upsert with { key: "main" }.
const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    name: { type: String, default: "Daniel Olojo" },
    title: { type: String, default: "Software Developer" },
    bio: { type: String, default: "" },
    email: { type: String, default: "" },
    location: { type: String, default: "Remote — open worldwide" },
    availability: { type: Boolean, default: true },
    socials: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    cvUrl: { type: String, default: "" },
    cvEnabled: { type: Boolean, default: true },
    heroHeadline: { type: String, default: "Software Developer" },
    heroSubtext: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SiteSettingsDoc = mongoose.InferSchemaType<typeof SiteSettingsSchema>;
export default models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
