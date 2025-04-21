import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import { config } from "../config/config.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Auth0 JWT validation middleware
export const validateAuth0Token = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
  }),
  audience: config.auth0.audience,
  issuer: `https://${config.auth0.domain}/`,
  algorithms: ["RS256"],
});

// Middleware to handle Auth0 user
export const handleAuth0User = asyncHandler(async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.sub) {
      throw new ApiError(401, "Unauthorized: Invalid Auth0 token");
    }

    const auth0Id = req.auth.sub;
    const email = req.auth[`${config.auth0.audience}/email`] || req.auth.email;
    const name = req.auth[`${config.auth0.audience}/name`] || req.auth.name;
    const picture = req.auth[`${config.auth0.audience}/picture`] || req.auth.picture;
    
    if (!email) {
      throw new ApiError(400, "Email is required from Auth0");
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { authProviderId: auth0Id }
      ]
    });

    if (!user) {
      // Create new user if not exists
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
      
      user = await User.create({
        username,
        email,
        fullName: name || username,
        authProvider: auth0Id.includes("google") ? "google" : 
                     auth0Id.includes("facebook") ? "facebook" : "local",
        authProviderId: auth0Id,
        avatar: picture || undefined,
      });
    } else if (!user.authProviderId) {
      // Update existing user with Auth0 info
      user.authProvider = auth0Id.includes("google") ? "google" : 
                         auth0Id.includes("facebook") ? "facebook" : "local";
      user.authProviderId = auth0Id;
      if (picture && !user.avatar.includes("cloudinary")) {
        user.avatar = picture;
      }
      await user.save();
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Auth0 token");
  }
});
