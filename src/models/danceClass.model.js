import mongoose, { Schema } from "mongoose";

const danceClassSchema = new Schema(
  {
    classType: {
      type: String,
      enum: ["NYC/NJ Group", "Private", "Online"],
      required: true,
    },
    classDate: {
      type: Date,
      required: true,
    },
    timeFrom: {
      type: Date,
      required: true,
    },
    timeTo: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
    },
    description: {
      type: String,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    ticketQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const DanceClass = mongoose.model("DanceClass", danceClassSchema);

export default DanceClass;
