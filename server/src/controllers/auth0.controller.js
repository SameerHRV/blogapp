import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get current Auth0 user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  // Generate JWT token for our API
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

  // Return user data and token
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
      "User fetched successfully",
    ),
  );
});

// Link Auth0 account with existing account
export const linkAccounts = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const auth0User = req.user;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find existing user by email
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  // Verify password
  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Update existing user with Auth0 info
  existingUser.authProvider = auth0User.authProvider;
  existingUser.authProviderId = auth0User.authProviderId;

  await existingUser.save();

  // Delete the temporary Auth0 user
  await User.findByIdAndDelete(auth0User._id);

  // Generate JWT token
  const accessToken = jwt.sign(
    {
      _id: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
      fullName: existingUser.fullName,
    },
    config.jwt.accessTokenSecret,
    {
      expiresIn: config.jwt.accessTokenExpiresIn,
    },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
          fullName: existingUser.fullName,
          avatar: existingUser.avatar,
          authProvider: existingUser.authProvider,
          createdAt: existingUser.createdAt,
        },
        accessToken,
      },
      "Accounts linked successfully",
    ),
  );
});
