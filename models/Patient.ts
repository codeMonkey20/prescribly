import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/prescribly");
const schema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  initals: { type: String },
  idNumber: { type: String },
  college: { type: String },
  phone: { type: String },
  birthdate: { type: Date },
  gender: { type: String },
  civilStatus: { type: String },
  address: { type: String },
  smoke: { type: Boolean },
  alcohol: { type: Boolean },
  allergies: { type: String },
  medications: { type: String },
  medicalConditions: { type: String },
});

export default mongoose.models.patients || mongoose.model("patients", schema);
