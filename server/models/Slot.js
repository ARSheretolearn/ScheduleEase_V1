import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  timeStart: { type: String, required: true }, // HH:MM
  timeEnd: { type: String, required: true },   // HH:MM
  isBooked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Slot", slotSchema);
