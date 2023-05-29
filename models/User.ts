import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/prescribly");
const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  usertype: { type: String, required: true },
  usertypeID: { type: String },
});

export default mongoose.models.users || mongoose.model("users", schema);
