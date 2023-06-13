import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.DB_URI ? process.env.DB_URI : "");
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

const schema = new mongoose.Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "users", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleInitial: { type: String },
    fullName: { type: String },
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
    healthConditions: { type: String },
    prescription: [prescription],
    doctor: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export default mongoose.models.patients || mongoose.model("patients", schema);
