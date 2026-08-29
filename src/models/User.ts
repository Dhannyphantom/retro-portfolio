import mongoose, { Schema, models, model } from "mongoose";

// Created automatically the first time someone submits a booking. passwordHash
// stays unset until they complete /account/setup — until then, the account
// exists (so their booking is linked to a real user record) but can't log in.
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    passwordHash: { type: String },
  },
  { timestamps: true }
);

export type UserDoc = mongoose.InferSchemaType<typeof UserSchema>;
export default models.User || model("User", UserSchema);
