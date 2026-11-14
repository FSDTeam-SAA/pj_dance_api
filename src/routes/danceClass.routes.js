import { Router } from "express";
import {
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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

