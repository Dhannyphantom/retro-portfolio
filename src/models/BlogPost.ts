import mongoose, { Schema, models, model } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export type BlogPostDoc = mongoose.InferSchemaType<typeof BlogPostSchema>;
export default models.BlogPost || model("BlogPost", BlogPostSchema);
