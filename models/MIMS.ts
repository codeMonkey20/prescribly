import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly");
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.mims || mongoose.model("mims", schema);
