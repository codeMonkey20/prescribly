import mongoose, { Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://twitter-admin:BCXPwV5Tmxkwcqzu@twitter-clone.xeolut6.mongodb.net/prescribly"
);
const queueArray = new Schema(
  {
    idNumber: { type: String },
  },
  { timestamps: true }
);

const schema = new Schema(
  {
    nurse: [queueArray],
    doctor: [queueArray],
    pharmacist: [queueArray],
  },
  { timestamps: true }
);

export default mongoose.models.queue || mongoose.model("queue", schema);
