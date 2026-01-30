import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true },
  clientName: { type: String, required: true, trim: true },
  boatName: { type: String, required: true, trim: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true }
});

export default mongoose.model("Reservation", reservationSchema);
