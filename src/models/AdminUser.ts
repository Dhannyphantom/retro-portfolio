import mongoose, { Schema, models, model } from "mongoose";

// Optional: only needed if you manage admin credentials in the DB instead of env vars.
const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminUserDoc = mongoose.InferSchemaType<typeof AdminUserSchema>;
export default models.AdminUser || model("AdminUser", AdminUserSchema);
