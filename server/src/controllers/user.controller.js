import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new user
export const createUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (!username || !email || !fullName || !password) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Create new user
  const user = new User({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullName,
    password,
  });

  // Upload avatar if provided
  if (req.file) {
    const avatarLocalPath = req.file.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (avatar) {
      user.avatar = avatar.url;
    }
  }

  const savedUser = await user.save();

  // Generate access token
  const accessToken = savedUser.AccessTokenGenerator();

  // Remove password from response
  const userWithoutPassword = await User.findById(savedUser._id).select("-password");

  // Set cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userWithoutPassword,
        accessToken,
      },
      "User registered successfully",
    ),
  );
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate access token
  const accessToken = user.AccessTokenGenerator();

  // Remove password from response
  const userWithoutPassword = await User.findById(user._id).select("-password");

  // Set cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userWithoutPassword,
        accessToken,
      },
      "User logged in successfully",
    ),
  );
});

// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");

  return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});

// change Password
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body;

  if (!fullName || !username || !email) {
    throw new ApiError(400, "Please provide all the required fields");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName.trim(),
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
      },
    },
    { new: true },
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "User profile updated successfully"));
});

// Update user avatar
export const updateUserAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarLocalPath = req.file.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});
