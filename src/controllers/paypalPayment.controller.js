import createPaypalClient from "../config/paypalConfig.js";
import paypal from "@paypal/checkout-server-sdk";
import PurchaseTicket from "../models/purchaseTicket.model.js";
import DanceClass from "../models/danceClass.model.js";

const getOrderDetails = async (orderId) => {
  const client = createPaypalClient();
  const request = new paypal.orders.OrdersGetRequest(orderId);

  try {
    const order = await client.execute(request);
    return order.result;
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    throw new Error("Unable to fetch order details.");
  }
};

const createPayment = async (req, res) => {
  const client = createPaypalClient();
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: req.body.amount,
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    return res.json({ id: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const capturePayment = async (req, res) => {
  const {
    danceClass,
    fullName,
    email,
    phoneNumber,
    ticketQuantity,
    amount,
    currency,
    orderId,
  } = req.body;

  // Validate input
  if (
    !danceClass ||
    !fullName ||
    !email ||
    !phoneNumber ||
    !ticketQuantity ||
    !amount ||
    !currency ||
    !orderId
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if dance class exists
    const danceClassFound = await DanceClass.findById(danceClass);
    if (!danceClassFound) {
      return res.status(404).json({ message: "Dance class not found." });
    }

    // Validate ticket availability
    if (danceClassFound.ticketQuantity < ticketQuantity) {
      return res.status(400).json({ message: "Not enough tickets available." });
    }

    const newPurchaseTicket = new PurchaseTicket({
      danceClass,
      fullName,
      email,
      phoneNumber,
      ticketQuantity,
    });
    await newPurchaseTicket.save();

    // Fetch order details
    const orderDetails = await getOrderDetails(orderId);
    if (orderDetails.status === "COMPLETED") {
      res.json({
        status: "COMPLETED",
        message: "This order has already been captured.",
        id: orderDetails.id,
      });
    }

    // Capture the payment
    const client = createPaypalClient();
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});

    const capture = await client.execute(captureRequest);

    if (capture.result.status === "COMPLETED") {
      // Save the ticket purchase

      // Update the ticket quantity
      danceClassFound.ticketQuantity -= ticketQuantity;
      await danceClassFound.save();

      return res.json({
        status: "COMPLETED",
        id: capture.result.id,
      });
    } else {
      return res.status(400).json({ message: "Payment capture failed." });
    }
  } catch (error) {
    console.error("Error capturing payment:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { createPayment, capturePayment };
