import mongoose from "mongoose";

mongoose.connect("mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly");
const schema = new mongoose.Schema(
  {
    email: { type: String },
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
