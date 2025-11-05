// Simple mock auth middleware for local testing.
// Expected headers:
//  - x-user-id : optional user id/email string
//  - x-user-role : internal | external | admin
//
// If a matching user is not found in DB, the middleware will create one using the provided x-user-id as email.
// This is for testing only; replace with real auth (JWT/OAuth) in production.

import User from "../models/User.js";

export const mockAuth = async (req, res, next) => {
  try {
    const headerId = req.header("x-user-id");
    const headerRole = req.header("x-user-role") || "internal";

    // If no headerId provided, create a temp anonymous external user (for testing)
    const email = headerId ? String(headerId) : `temp_${Date.now()}@example.com`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: email.split("@")[0], email, role: headerRole });
    } else {
      // if headerRole provided, ensure role matches (useful for testing switching roles)
      if (headerRole && user.role !== headerRole) {
        user.role = headerRole;
        await user.save();
      }
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    next(err);
  }
};
