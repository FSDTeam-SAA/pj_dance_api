import { frontendBaseUrl, stripSecret } from "../config/index.js";
import DanceClass from "../models/danceClass.model.js";
import NewsLetter from "../models/newsLetter.model.js";
import PurchaseTicket from "../models/purchaseTicket.model.js";
import Stripe from "stripe";

// const stripe = Stripe(stripSecret);

// const purchaseTicket = async (req, res) => {
//   try {
//     const {
//       danceClass,
//       fullName,
//       email,
//       phoneNumber,
//       ticketQuantity,
//       amount,
//       currency,
//     } = req.body;

//     console.log(req.body);

//     if (
//       !danceClass ||
//       !fullName ||
//       !email ||
//       !phoneNumber ||
//       !ticketQuantity ||
//       !amount ||
//       !currency
//     ) {
//       return res
//         .status(400)
//         .json({ status: 400, message: "all fields are required" });
//     }

//     const danceClassFound = await DanceClass.findById(danceClass);
//     if (!danceClassFound) {
//       return res
//         .status(404)
//         .json({ status: 404, message: "dance class not found" });
//     }

//     if (danceClassFound.ticketQuantity < ticketQuantity) {
//       return res
//         .status(400)
//         .json({ status: 400, message: "not enough tickets available" });
//     }

//     const newPurchaseTicket = new PurchaseTicket({
//       danceClass,
//       fullName,
//       email,
//       phoneNumber,
//       ticketQuantity,
//     });

//     await newPurchaseTicket.save();

//     danceClassFound.ticketQuantity -= ticketQuantity;
//     await danceClassFound.save();

//     const totalAmountInCents = amount * 100;
//     await stripe.paymentIntents.create({
//       amount: totalAmountInCents,
//       currency,
//     });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency,
//             product_data: {
//               name: "Purchase",
//             },
//             unit_amount: totalAmountInCents,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${frontendBaseUrl}/success`,
//       cancel_url: `${frontendBaseUrl}/cancel`,
//     });

//     const newsLetter = await NewsLetter.findOne({ email: email });
//     if (newsLetter) {
//       console.log("user already subscribed to the newsletter");
//     } else {
//       await NewsLetter.create({ email: email });
//     }

//     return res.status(201).json({
//       status: 201,
//       message: "payment done",
//       url: session.url,
//     });
//   } catch (error) {
//     console.error("error purchasing ticket", error);
//     res
//       .status(500)
//       .json({ message: "internal server error", error: error.message });
//   }
// };

// export { purchaseTicket };

// import { frontendBaseUrl, stripeSecret } from "../config/index.js";
// import DanceClass from "../models/danceClass.model.js";
// import NewsLetter from "../models/newsLetter.model.js";
// import PurchaseTicket from "../models/purchaseTicket.model.js";
// import Stripe from "stripe";

const stripe = new Stripe(stripSecret);

const purchaseTicket = async (req, res) => {
  try {
    const {
      danceClass,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
      amount,
      instagram,
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
      return res.status(400).json({ message: "All fields are required" });
    }

    const danceClassFound = await DanceClass.findById(danceClass);
    if (!danceClassFound) {
      return res.status(404).json({ message: "Dance class not found" });
    }

    if (danceClassFound.ticketQuantity < ticketQuantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Reduce available tickets and save the purchase
    danceClassFound.ticketQuantity -= ticketQuantity;
    await danceClassFound.save();

    const newPurchaseTicket = new PurchaseTicket({
      danceClass,
      fullName,
      email,
      phoneNumber,
      instagram,
      ticketQuantity,
    });
    await newPurchaseTicket.save();

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `${danceClassFound.name} Tickets`,
            },
            unit_amount: Math.round(amount * 100), // Convert amount to cents
          },
          quantity: ticketQuantity,
        },
      ],
      // success_url: `${frontendBaseUrl}/success`,
      success_url: `http://localhost:3001/success`,
      cancel_url: `${frontendBaseUrl}/cancel`,
    });

    console.log(frontendBaseUrl);

    // Handle newsletter subscription
    const newsLetter = await NewsLetter.findOne({ email });
    if (!newsLetter) {
      await NewsLetter.create({ email });
    }

    res.status(201).json({
      message: "Checkout session created successfully",
      url: session.url,
    });
  } catch (error) {
    console.error("Error in purchaseTicket:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { purchaseTicket };
