import User from "../models/User.js";

import { generateToken } from "../utils/generateToken.js";


// ✅ Admin emails hardcoded
const adminEmails = ["director@nitc.ac.in", "pa@nitc.ac.in"];

/**
 * @route POST /api/auth/login
 * @desc Login using OAuth profile info (email, googleId etc)
 * @access Public
 */
export const oauthLogin = async (req, res) => {
  try {
    const { email, name, googleId, profileImage } = req.body;

    if (!email || !googleId)
      return res.status(400).json({ message: "Email and Google ID required" });

    let user = await User.findOne({ email });

    if (!user) {
      const domain = email.split("@")[1];
      let role = "external user";

      if (domain === "nitc.ac.in") role = "internal user";
      if (email === "director@nitc.ac.in" || email === "admin@nitc.ac.in") {
        role = "admin";
      }

      user = await User.create({
        email,
        name,
        googleId,
        profileImage,
        role_name: role,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @route POST /api/auth/logout
 * @desc Logout (client deletes token)
 * @access Public
 */
export const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};
