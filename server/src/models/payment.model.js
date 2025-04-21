import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    stripeSessionId: {
      type: String,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planName: {
      type: String,
      required: true,
      enum: ["Pro", "Business"],
    },
    status: {
      type: String,
      enum: ["created", "attempted", "paid", "failed"],
      default: "created",
    },
    paymentDate: {
      type: Date,
    },
    validUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = mongoose.model("Payment", paymentSchema);
