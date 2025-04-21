import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { hasReachedPostLimit, getRemainingPosts } from "../config/subscriptionLimits.js";

// Middleware to check if user has reached post limit
export const checkPostLimit = async (req, res, next) => {
  try {
    const user = req.user;

    // Skip check for non-authenticated requests
    if (!user) {
      return next();
    }

    // Check if user has reached post limit
    const reachedLimit = await hasReachedPostLimit(user, Post);

    if (reachedLimit) {
      throw new ApiError(
        403,
        "You have reached the maximum number of posts allowed for your subscription plan. Please upgrade to create more posts.",
      );
    }

    // Add remaining posts info to request for potential use in controllers
    req.subscription = {
      ...req.subscription,
      remainingPosts: await getRemainingPosts(user, Post),
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to add subscription info to request
export const addSubscriptionInfo = async (req, res, next) => {
  try {
    const user = req.user;

    // Skip for non-authenticated requests
    if (!user) {
      return next();
    }

    // Get remaining posts
    const remainingPosts = await getRemainingPosts(user, Post);

    // Add subscription info to request
    req.subscription = {
      plan: user.subscription?.plan || "Free",
      isActive: user.subscription?.isActive || false,
      validUntil: user.subscription?.validUntil,
      remainingPosts,
      hasReachedLimit: remainingPosts === 0,
    };

    next();
  } catch (error) {
    next(error);
  }
};
