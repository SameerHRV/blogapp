import { Router } from "express";
import {
  createCheckoutSession,
  getPaymentHistory,
  getSubscriptionStatus,
  handleWebhook,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Webhook route (no authentication required)
router.post("/payments/webhook", handleWebhook);

// Protected routes
router.use("/payments", verifyJWT);
router.post("/payments/create-checkout-session", createCheckoutSession);
router.post("/payments/verify", verifyPayment);
router.get("/payments/history", getPaymentHistory);
router.get("/payments/subscription", getSubscriptionStatus);

export { router as paymentRouter };
