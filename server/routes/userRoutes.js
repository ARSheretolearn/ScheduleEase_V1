import express from "express";
import { mockAuth } from "../middleware/mockAuth.js";
const router = express.Router();

router.get("/me", mockAuth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

export default router;
