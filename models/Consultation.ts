import mongoose, { Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly"
);

const intervention = new Schema({
  time: { type: String },
  description: { type: String },
  nurse: { type: String },
  nurseFullName: { type: String },
});

const schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "users" },
    idNumber: { type: String },
    consultationNumber: { type: Number },
    currentMedications: { type: String },
    interventions: [intervention],
  },
  { timestamps: true }
);

export default mongoose.models.consultations ||
  mongoose.model("consultations", schema);
