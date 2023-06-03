import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/prescribly");
const prescription = new mongoose.Schema({
  medicationName: { type: String },
  dosage: { type: String },
  form: { type: String },
  purpose: { type: String },
  route: { type: String },
  frequency: { type: String },
  dispense: { type: String },
  given: { type: String },
  remarks: { type: String },
});

const schema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
  idNumber: { type: String, required: true },
  healthConditions: { type: String },
  prescriptions: [prescription],
});

export default mongoose.models.prescriptions || mongoose.model("prescriptions", schema);
