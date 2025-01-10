import { Router } from "express";
import {
  createDanceClass,
  deleteDanceClass,
  getAllDanceClasses,
  getSpecificDanceClass,
  updateDanceClass,
} from "../controllers/danceClass.controller.js";

const router = Router();

router.route("/").post(createDanceClass);
router
  .route("/:id")
  .get(getSpecificDanceClass)
  .put(updateDanceClass)
  .delete(deleteDanceClass);
router.route("/").get(getAllDanceClasses);

export default router;
