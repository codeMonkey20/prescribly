import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly");
const schema = new mongoose.Schema(
  {
    // userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
    medicineName: { type: String, required: true },
    defaultForm: { type: String },
    defaultDosage: { type: String },
    defaultRoute: { type: String },
    defaultFrequency: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.mims || mongoose.model("mims", schema);
