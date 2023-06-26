import mongoose, { Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly"
);
const prescription = new Schema(
  {
    medicationName: { type: String },
    dosage: { type: String },
    form: { type: String },
    purpose: { type: String },
    route: { type: String },
    frequency: { type: String },
    dispense: { type: String },
    given: { type: String },
    remarks: { type: String },
    duration: { type: String },
  },
  { timestamps: true }
);

const schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "users" },
    pharmacist: { type: String },
    idNumber: { type: String },
    comments: { type: String },
    prescription: [prescription],
  }
)

export default mongoose.models.prescriptions ||
  mongoose.model("prescriptions", schema);
