import mongoose from "mongoose";

mongoose.connect(process.env.DB_URI ? process.env.DB_URI : "");
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
