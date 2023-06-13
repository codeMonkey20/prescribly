import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/prescribly");
const schema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    usertype: { type: String, required: true },
    usertypeID: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.users || mongoose.model("users", schema);
