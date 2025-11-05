import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
import { sendEmail } from "./notificationController.js";

// GET /api/appointments
// Admin gets all, others get their own
export const getAppointments = async (req, res) => {
  try {
    const { role_name, _id } = req.user;

    const filter = role_name === "admin" 
      ? { is_deleted: false } 
      : { user: _id, is_deleted: false };

    const appts = await Appointment.find(filter)
      .populate("user")
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { slotId, title, description } = req.body;
    const { _id, role_name, email } = req.user;

    if (role_name === "admin") {
      return res.status(403).json({ message: "Admin cannot book appointments" });
    }

    if (!slotId || !title || !description) {
      return res.status(400).json({ message: "Slot, title and description required" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot || slot.is_booked) {
      return res.status(400).json({ message: "Slot unavailable" });
    }

    const status = role_name === "internal user" ? "approved" : "pending";

    const appt = await Appointment.create({
      user: _id,
      slot: slot._id,
      title,
      description,
      role_name,
      status,
    });

    slot.is_booked = true;
    await slot.save();

    sendEmail({
      to: email,
      subject: `Appointment ${status}`,
      text: `Your appointment has been ${status}.`
    }).catch(() => {});

    res.status(201).json(await appt.populate("slot").populate("user"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("user")
      .populate("slot");

    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Not found" });

    if (
      req.user.role_name !== "admin" &&
      String(appt.user._id) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id  (reschedule/update)
export const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Not found" });

    if (
      req.user.role_name !== "admin" &&
      String(appt.user) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { slotId, title, description } = req.body;

    if (slotId && String(appt.slot) !== String(slotId)) {
      const oldSlot = await Slot.findById(appt.slot);
      if (oldSlot) {
        oldSlot.is_booked = false;
        await oldSlot.save();
      }

      const newSlot = await Slot.findById(slotId);
      if (!newSlot || newSlot.is_booked)
        return res.status(400).json({ message: "New slot unavailable" });

      appt.slot = newSlot._id;
      newSlot.is_booked = true;
      await newSlot.save();
    }

    if (title) appt.title = title;
    if (description) appt.description = description;

    if (req.user.role_name === "external user")
      appt.status = "pending";

    await appt.save();

    sendEmail({
      to: req.user.email,
      subject: `Appointment Updated`,
      text: `Your appointment has been modified.`
    }).catch(() => {});

    res.json(await appt.populate("slot").populate("user"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE
export const deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt)
      return res.status(404).json({ message: "Not found" });

    if (
      req.user.role_name !== "admin" &&
      String(appt.user) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const slot = await Slot.findById(appt.slot);
    if (slot) {
      slot.is_booked = false;
      await slot.save();
    }

    appt.is_deleted = true;
    appt.status = "cancelled";
    await appt.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN — Approve / Reject
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role_name !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const appt = await Appointment.findById(req.params.id)
      .populate("user slot");
    if (!appt)
      return res.status(404).json({ message: "Not found" });

    appt.status = status;
    await appt.save();

    if (status === "rejected") {
      const slot = await Slot.findById(appt.slot._id);
      if (slot) {
        slot.is_booked = false;
        await slot.save();
      }
    }

    sendEmail({
      to: appt.user.email,
      subject: `Appointment ${status}`,
      text: `Your appointment has been ${status} by the Admin.`
    }).catch(() => {});

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
