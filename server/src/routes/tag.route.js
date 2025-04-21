import { Router } from "express";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTagBySlug,
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/tags", getAllTags);
router.get("/tags/:slug", getTagBySlug);

// Protected routes (admin only)
router.use("/tags", verifyJWT);
router.post("/tags", createTag);
router.delete("/tags/:id", deleteTag);

export { router as tagRouter };
