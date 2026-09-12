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
    // Profile photo shown on the hero "ID card" — uploaded via
    // /admin/profile, stored as a plain URL (R2 or otherwise), same pattern
    // as cvUrl. Falls back to the pixel-art placeholder avatar when unset.
    avatarUrl: { type: String, default: "" },
    // A list of titles the hero's typewriter cycles through, one at a
    // time, on repeat — replaces the old single `heroHeadline` string.
    heroHeadlines: { type: [String], default: ["Software Developer"] },
    heroSubtext: { type: String, default: "" },
    meetDeveloperBio: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SiteSettingsDoc = mongoose.InferSchemaType<typeof SiteSettingsSchema>;
export default models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
