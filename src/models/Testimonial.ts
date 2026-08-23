import mongoose, { Schema, models, model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    position: { type: String },
    company: { type: String },
    avatar: { type: String },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    project: { type: String },
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TestimonialDoc = mongoose.InferSchemaType<typeof TestimonialSchema>;
export default models.Testimonial || model("Testimonial", TestimonialSchema);
