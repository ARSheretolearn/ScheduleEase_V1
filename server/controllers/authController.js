import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const adminEmails = ["director@nitc.ac.in", "admin@nitc.ac.in"];

export const oauthLogin = async (req, res) => {
  try {
    const { email, name, googleId, profileImage } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Email and Google ID required" });
    }

    // Fetch existing user
    let user = await User.findOne({ email });
    console.log("Fetched user:", user);

    if (!user) {
      // Determine role only for new users
      const domain = email.split("@")[1];
      let role = "external";

    
      if (adminEmails.includes(email)) role = "admin";
      //else if (domain === "nitc.ac.in") role = "internal user";
      //else role = "external user";
      

      // Create new user
      user = await User.create({
        name,
        email,
        google_id: googleId,
        profileImage,
        role,
      });
      console.log("Created user:", user);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("OAuth login error:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * @route POST /api/auth/logout
 * @desc Logout (client deletes token)
 * @access Public
 */
export const logoutUser = (req, res) => {
  req.logout(() => {
    req.session?.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

