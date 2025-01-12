import { Router } from "express";
import { purchaseTicket } from "../controllers/purchaseTicket.controller.js";
import {
  capturePayment,
  createPayment,
} from "../controllers/paypalPayment.controller.js";

const router = Router();

router.route("/stripe").post(purchaseTicket);
// router.post("/paypal", createPayment);
router.post("/paypal-capture", capturePayment);

export default router;
