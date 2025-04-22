import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from header or cookies
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log("Auth middleware: Token received:", token ? "[TOKEN FOUND]" : "[NO TOKEN]");

    if (!token) {
      console.log("Auth middleware: No token provided");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Check if JWT secret is configured
    if (!config.jwt.accessTokenSecret) {
      console.error("Auth middleware: JWT secret is not configured");
      return res.status(500).json({ message: "Server configuration error - JWT secret not set" });
    }

    try {
      // Verify token
      const decodedToken = jwt.verify(token, config.jwt.accessTokenSecret);
      console.log("Auth middleware: Token verified successfully");
      console.log("Auth middleware: Token payload:", {
        _id: decodedToken._id,
        email: decodedToken.email,
        exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toISOString() : "Not set",
      });

      // Find user with the id from token
      const user = await User.findById(decodedToken._id).select("-password");

      if (!user) {
        console.log(`Auth middleware: User not found for ID ${decodedToken._id}`);
        return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      console.log(`Auth middleware: User found: ${user.username} (${user._id})`);

      // Attach user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      console.error("Auth middleware: JWT verification error:", jwtError.message);
      return res.status(401).json({ message: `Unauthorized - Invalid token: ${jwtError.message}` });
    }
  } catch (error) {
    console.error("Auth middleware: Unexpected error:", error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
