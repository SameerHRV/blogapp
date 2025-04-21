import { Router } from "express";
import {
  changePassword,
  createUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.post("/users/register", upload.single("avatar"), createUser);
router.post("/users/login", loginUser);

// Protected routes
router.use("/users", verifyJWT);
router.get("/users/me", getCurrentUser);
router.put("/users/change-password", changePassword);
router.post("/users/logout", logoutUser);
router.patch("/users/update-profile", updateUserProfile);
router.patch("/users/update-avatar", upload.single("avatar"), updateUserAvatar);

export { router };
