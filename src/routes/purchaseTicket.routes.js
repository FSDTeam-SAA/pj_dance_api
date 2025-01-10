import { Router } from "express";
import {
  buyTicketWithStripe,
  purchaseTicket,
} from "../controllers/purchaseTicket.controller.js";
import {
  capturePayment,
  createPayment,
} from "../controllers/paypalPayment.controller.js";

const router = Router();

router.route("/").post(purchaseTicket);
router.post("/stripe", buyTicketWithStripe);
router.post("/paypal", createPayment);
router.post("/paypal-capture", capturePayment);

export default router;
