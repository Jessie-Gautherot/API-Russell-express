import mongoose from "mongoose";

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: ["long", "short"]
    },
    catwayState: {
      type: String,
      required: true,
      trim: true
    }
  },
);

export default mongoose.model("Catway", catwaySchema);
