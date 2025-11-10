import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
    address: { type: String, default: "" },
    theme: { type: String, default: "light" },
    color: { type: String, default: "#0078ff" }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    card: cardSchema // store the generator data under each user
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
