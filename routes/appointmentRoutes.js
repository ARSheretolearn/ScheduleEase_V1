import express from "express";
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { mockAuth } from "../middleware/mockAuth.js";

const router = express.Router();

router.use(mockAuth);

router.route("/")
  .get(getAppointments)
  .post(createAppointment);

router.route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.put("/:id/status", updateAppointmentStatus);

export default router;
