import Slot from "../models/Slot.js";

// GET /api/slots
export const getSlots = async (req, res) => {
  try {
    // allow query ?date=YYYY-MM-DD to filter
    const q = {};
    if (req.query.date) q.date = req.query.date;
    const slots = await Slot.find(q).sort({ date: 1, timeStart: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/slots (admin only)
export const createSlot = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const { date, timeStart, timeEnd } = req.body;
    if (!date || !timeStart || !timeEnd) return res.status(400).json({ message: "Missing fields" });
    const slot = await Slot.create({ date, timeStart, timeEnd });
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/slots/:id (admin only)
export const updateSlot = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) return res.status(404).json({ message: "Not found" });
    res.json(slot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/slots/:id (admin only)
export const deleteSlot = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
