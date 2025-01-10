import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/").post(createUser);
router.route("/login").post(loginUser);

export default router;
