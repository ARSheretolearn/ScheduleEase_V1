import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { logoutUser } from "../controllers/authController.js";

const router = express.Router();

// ✅ Step 1: Start Google OAuth — with role parameter
router.get("/google", (req, res, next) => {
  const { role } = req.query; // from frontend ?role=admin
  req.session = req.session || {};
  req.session.role = role; // store in session for later use
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Step 2: Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect to frontend with JWT
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// ✅ Logout route
router.post("/logout", logoutUser);

export default router;
