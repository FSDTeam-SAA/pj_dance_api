import mongoose, { Schema } from "mongoose";

const purchaseTicketSchema = new Schema(
  {
    danceClass: {
      type: mongoose.Types.ObjectId,
      ref: "DanceClass",
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    ticketQuantity: {
      type: Number,
    },
    instagram: {
      type: String,
    },
  },
  { timestamps: true }
);

const PurchaseTicket = mongoose.model("PurchaseTicket", purchaseTicketSchema);

export default PurchaseTicket;
