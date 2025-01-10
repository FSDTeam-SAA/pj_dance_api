import { Router } from "express";
import {
  getAllSubscribedUsers,
  joinNewsletter,
  sendClassNotification,
  sendNewsLetter,
} from "../controllers/newsLetter.controller.js";

const router = Router();

router.route("/join").post(joinNewsletter);
router.route("/send").post(sendNewsLetter);
router.route("/").get(getAllSubscribedUsers);
router.route("/notification").post(sendClassNotification);

export default router;
