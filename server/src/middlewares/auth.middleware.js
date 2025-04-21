import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from header or cookies
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Verify token
    const decodedToken = jwt.verify(token, config.jwt.accessTokenSecret);

    // Find user with the id from token
    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
