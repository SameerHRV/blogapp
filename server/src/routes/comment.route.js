import { Router } from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/posts/:postId/comments", getPostComments);

// Allow guest comments
router.post("/comments", createComment);

// Protected routes for editing and deleting
router.use("/comments/:id", verifyJWT);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

export { router as commentRouter };
