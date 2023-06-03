import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/prescribly");
const schema = new mongoose.Schema({
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
});

export default mongoose.models.staffs || mongoose.model("staffs", schema);
