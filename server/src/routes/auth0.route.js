import { Router } from "express";
import { getCurrentUser, linkAccounts } from "../controllers/auth0.controller.js";
import { validateAuth0Token, handleAuth0User } from "../middlewares/auth0.middleware.js";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// Auth0 routes
router.get("/auth/me", validateAuth0Token, handleAuth0User, getCurrentUser);
router.post("/auth/link-accounts", validateAuth0Token, handleAuth0User, linkAccounts);

// Development fallback route for Auth0 authentication
if (config.env === "development") {
  console.log("Adding development fallback route for Auth0 authentication");

  router.get("/auth/dev-login", async (req, res) => {
    try {
      console.log("Development login route called");

      // Find or create a test user
      let user = await User.findOne({ email: "test@example.com" });
      console.log("Existing test user found:", !!user);

      if (!user) {
        console.log("Creating new test user");
        user = await User.create({
          username: "testuser",
          email: "test@example.com",
          fullName: "Test User",
          authProvider: "local",
          authProviderId: "dev-auth0|testuser",
          avatar: "https://via.placeholder.com/150",
        });
        console.log("Test user created with ID:", user._id);
      }

      // Generate JWT token with the correct secret
      console.log(
        "Generating JWT token with secret:",
        config.jwt.accessTokenSecret ? "[SECRET SET]" : "[SECRET MISSING]",
      );
      console.log("JWT token expiration:", config.jwt.accessTokenExpiresIn);

      const accessToken = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
        },
        config.jwt.accessTokenSecret,
        {
          expiresIn: config.jwt.accessTokenExpiresIn,
        },
      );

      console.log("JWT token generated successfully");

      // Return the user and token
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            user: {
              _id: user._id,
              email: user.email,
              username: user.username,
              fullName: user.fullName,
              avatar: user.avatar,
              authProvider: user.authProvider,
              createdAt: user.createdAt,
            },
            accessToken,
          },
          "Development login successful",
        ),
      );
    } catch (error) {
      console.error("Development login error:", error);
      return res.status(500).json({ message: error.message || "Development login failed" });
    }
  });

  // Add a test endpoint to verify token validation
  router.get("/auth/test-token", async (req, res) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      try {
        const decoded = jwt.verify(token, config.jwt.accessTokenSecret);
        return res.status(200).json({
          message: "Token is valid",
          decoded,
        });
      } catch (tokenError) {
        return res.status(401).json({ message: `Token validation failed: ${tokenError.message}` });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
}

export { router as auth0Router };
