import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",
      passReqToCallback: true, // ✅ so we can access req.session.role
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Use role stored in session (from button click)
        const selectedRole = req.session?.role;

        let user = await User.findOne({ email });

        if (!user) {
          // Assign role
          let role;
          if (selectedRole) {
            role = selectedRole;
          } else {
            const domain = email.split("@")[1];
            role = domain === "nitc.ac.in" ? "internal user" : "external user";
          }

          user = await User.create({
            name: profile.displayName,
            email,
            role,
            googleId: profile.id,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ✅ Required for persistent sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;

