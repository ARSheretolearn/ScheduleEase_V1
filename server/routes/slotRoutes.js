import express from "express";
import {
  getSlots,
  createSlot,
  updateSlot,
  deleteSlot
} from "../controllers/slotController.js";

const router = express.Router();

router.route("/")
  .get(getSlots)
  .post(createSlot);

router.route("/:id")
  .put(updateSlot)
  .delete(deleteSlot);

export default router;
