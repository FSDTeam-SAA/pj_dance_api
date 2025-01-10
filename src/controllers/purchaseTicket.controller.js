import { stripSecret } from "../config/index.js";
import DanceClass from "../models/danceClass.model.js";
import NewsLetter from "../models/newsLetter.model.js";
import PurchaseTicket from "../models/purchaseTicket.model.js";
import Stripe from "stripe";

const stripe = Stripe(stripSecret);

const purchaseTicket = async (req, res) => {
  try {
    const {
      danceClass,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
      amount,
      currency,
    } = req.body;

    if (
      !danceClass ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !ticketQuantity ||
      !amount ||
      !currency
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "all fields are required" });
    }

    const danceClassFound = await DanceClass.findById(danceClass);
    if (!danceClassFound) {
      return res
        .status(404)
        .json({ status: 404, message: "dance class not found" });
    }

    if (danceClassFound.ticketQuantity < ticketQuantity) {
      return res
        .status(400)
        .json({ status: 400, message: "not enough tickets available" });
    }

    const newPurchaseTicket = new PurchaseTicket({
      danceClass,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
    });

    const ticket = await newPurchaseTicket.save();

    danceClassFound.ticketQuantity -= ticketQuantity;
    await danceClassFound.save();

    const totalAmountInCents = amount * 100;
    await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Purchase",
            },
            unit_amount: totalAmountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel",
    });

    const newsLetter = await NewsLetter.findOne({ email: email });
    if (newsLetter) {
      console.log("user already subscribed to the newsletter");
    } else {
      await NewsLetter.create({ email: email });
    }

    return res.status(201).json({
      status: 201,
      message: "payment done",
      url: session.url,
    });
  } catch (error) {
    console.error("error purchasing ticket", error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};


const buyTicketWithStripe = async (req, res) => {
  try {
    const {
      classId,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
      amount,
      currency,
    } = req.body;

    const newticket = await Ticket.create({
      classId,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
      amount,
      currency,
    });

    const newsLetter = await NewsLetter.findOne({ email: email });
    if (newsLetter) {
      console.log("User already subscribed to the newsletter.");
    } else {
      await NewsLetter.create({ email: email });
    }

    return res.status(201).json({
      status: 201,
      message: "Payment done",
      url: session.url,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Server error", data: error.message });
  }
};

export { purchaseTicket, buyTicketWithStripe };
