import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  toggleLikePost,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkPostLimit, addSubscriptionInfo } from "../middlewares/subscription.middleware.js";

const router = Router();

// Public routes
router.get("/posts", addSubscriptionInfo, getAllPosts);

// Subscription info route - must be defined BEFORE the :slug route to avoid conflicts
router.get("/posts/subscription-info", verifyJWT, addSubscriptionInfo, (req, res) => {
  // If user is authenticated, req.subscription will be set by the middleware
  // If not, we'll provide default values for non-authenticated users
  const subscriptionInfo = req.subscription || {
    plan: "Free",
    isActive: false,
    remainingPosts: 0,
    hasReachedLimit: true,
  };

  res.status(200).json({
    success: true,
    data: {
      subscription: subscriptionInfo,
    },
    message: "Subscription info fetched successfully",
  });
});

// Post by slug route - must come after specific routes
router.get("/posts/:slug", addSubscriptionInfo, getPostBySlug);

// Allow guest posts
router.post("/posts/create-post", upload.single("coverImage"), createPost);

// Protected routes with subscription limits
router.post(
  "/posts/create-authenticated-post",
  verifyJWT,
  checkPostLimit,
  upload.single("coverImage"),
  createPost,
);
// Protected routes for editing, deleting, and liking
router.use("/posts/:id", verifyJWT);
router.put("/posts/:id", upload.single("coverImage"), updatePost);
router.delete("/posts/:id", deletePost);
router.post("/posts/:id/like", toggleLikePost);

export { router as postRouter };
