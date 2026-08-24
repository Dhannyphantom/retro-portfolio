import mongoose, { Schema, models, model } from "mongoose";

// Powers both the hero's orbiting badges and the marquee strip. `showInHero`
// and `showInMarquee` let the same entry appear in either or both places.
const TechStackSchema = new Schema(
  {
    name: { type: String, required: true },
    iconUrl: { type: String, required: true }, // e.g. https://cdn.simpleicons.org/react
    showInHero: { type: Boolean, default: false },
    showInMarquee: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TechStackDoc = mongoose.InferSchemaType<typeof TechStackSchema>;
export default models.TechStack || model("TechStack", TechStackSchema);
