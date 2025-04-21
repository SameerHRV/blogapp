import { Router } from "express";
import { getCurrentUser, linkAccounts } from "../controllers/auth0.controller.js";
import { validateAuth0Token, handleAuth0User } from "../middlewares/auth0.middleware.js";

const router = Router();

// Auth0 routes
router.get("/auth/me", validateAuth0Token, handleAuth0User, getCurrentUser);
router.post("/auth/link-accounts", validateAuth0Token, handleAuth0User, linkAccounts);

export { router as auth0Router };
