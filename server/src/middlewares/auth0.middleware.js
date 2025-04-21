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
    // Log the Auth0 token for debugging
    console.log("Auth0 token received:", req.auth ? "Valid token" : "No token");
    console.log("Auth0 token claims:", req.auth ? Object.keys(req.auth) : "None");

    if (!req.auth || !req.auth.sub) {
      throw new ApiError(401, "Unauthorized: Invalid Auth0 token");
    }

    const auth0Id = req.auth.sub;
    console.log("Auth0 ID:", auth0Id);

    // Try multiple possible locations for email
    let email = req.auth.email;
    if (!email && req.auth[`${config.auth0.audience}/email`]) {
      email = req.auth[`${config.auth0.audience}/email`];
    }
    if (!email && req.auth[`email`]) {
      email = req.auth[`email`];
    }
    if (!email && req.auth[`https://example.com/email`]) {
      email = req.auth[`https://example.com/email`];
    }

    // Try to extract email from Auth0 ID if still not found
    if (!email && auth0Id.includes("@")) {
      email = auth0Id.split("|")[1];
    }

    // For development, if email is still not found, use a default one based on the Auth0 ID
    if (!email && process.env.NODE_ENV === "development") {
      console.log("Using fallback email for development");
      email = `${auth0Id.split("|")[1].replace(/[^a-zA-Z0-9]/g, "")}@example.com`;
    }

    console.log("Email found:", email || "Not found");

    // Get name and picture from various possible locations
    const name =
      req.auth[`${config.auth0.audience}/name`] ||
      req.auth.name ||
      req.auth[`name`] ||
      req.auth[`https://example.com/name`];
    const picture =
      req.auth[`${config.auth0.audience}/picture`] ||
      req.auth.picture ||
      req.auth[`picture`] ||
      req.auth[`https://example.com/picture`];

    console.log("Name found:", name || "Not found");
    console.log("Picture found:", picture ? "Yes" : "No");

    if (!email) {
      throw new ApiError(
        400,
        "Email is required from Auth0. Please check Auth0 configuration to ensure email is included in the token.",
      );
    }

    // Check if user exists
    let user = await User.findOne({
      $or: [{ email }, { authProviderId: auth0Id }],
    });

    if (!user) {
      // Create new user if not exists
      const username = email.split("@")[0] + Math.floor(Math.random() * 1000);

      user = await User.create({
        username,
        email,
        fullName: name || username,
        authProvider: auth0Id.includes("google")
          ? "google"
          : auth0Id.includes("facebook")
            ? "facebook"
            : "local",
        authProviderId: auth0Id,
        avatar: picture || undefined,
      });
    } else if (!user.authProviderId) {
      // Update existing user with Auth0 info
      user.authProvider = auth0Id.includes("google")
        ? "google"
        : auth0Id.includes("facebook")
          ? "facebook"
          : "local";
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
