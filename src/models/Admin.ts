import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  region: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
