import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly");
const schema = new mongoose.Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleInitial: { type: String },
    phone: { type: String },
    birthdate: { type: Date },
    address: { type: String },
    license: { type: String },
    expire: { type: Date },
    signature: { type: String },
    terms: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.models.staffs || mongoose.model("staffs", schema);
