import mongoose, { Schema } from "mongoose";

mongoose.connect("mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly");
const prescription = new mongoose.Schema(
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

const healthRecord = new Schema(
  {
    familyHistory: { type: String },

    // vital signs
    temperature: { type: Number },
    pulse: { type: Number },
    respiration: { type: Number },
    bloodPressure: { type: String },
    weight: { type: Number },

    // physical exam
    skin: { type: String },
    skinRemarks: { type: String },
    headNeckScalp: { type: String },
    headNeckScalpRemarks: { type: String },
    eyes: { type: String },
    eyesRemarks: { type: String },
    ears: { type: String },
    earsRemarks: { type: String },
    noseSinuses: { type: String },
    noseSinusesRemarks: { type: String },
    mouthThroat: { type: String },
    mouthThroatRemarks: { type: String },
    neckThyroid: { type: String },
    neckThyroidRemarks: { type: String },
    chestBreastAxilla: { type: String },
    chestBreastAxillaRemarks: { type: String },
    lungs: { type: String },
    lungsRemarks: { type: String },
    heart: { type: String },
    heartRemarks: { type: String },
    abdomen: { type: String },
    abdomenRemarks: { type: String },
    backFlank: { type: String },
    backFlankRemarks: { type: String },
    anusRectum: { type: String },
    anusRectumRemarks: { type: String },
    gu: { type: String },
    guRemarks: { type: String },
    genitals: { type: String },
    genitalsRemarks: { type: String },
    reflexes: { type: String },
    reflexesRemarks: { type: String },
    extremities: { type: String },
    extremitiesRemarks: { type: String },
    neurologic: { type: String },
    neurologicRemarks: { type: String },
    endocrine: { type: String },
    endocrineRemarks: { type: String },
    others: { type: String },
    othersRemarks: { type: String },
  },
  { timestamps: true }
);

const interventions = new Schema(
  {
    description: { type: String },
    nurse: { type: Schema.Types.ObjectId, ref: "users" },
    nurseFullName: { type: String },
  },
  { timestamps: true }
);

const consultation = new Schema(
  {
    consultationNumber: { type: Number },
    currentMedications: { type: String },
    interventions: [interventions],
  },
  { timestamps: true }
);

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
    examinedBy: { type: Schema.Types.ObjectId, ref: "users" },
    lastMenstrualPeriod: { type: Date },
    menstrualPattern: { type: String },
    electronicHealthRecord: healthRecord,
    consultation: consultation,
  },
  { timestamps: true }
);

export default mongoose.models.patients || mongoose.model("patients", schema);
