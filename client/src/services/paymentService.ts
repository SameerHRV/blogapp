import api from "@/lib/api";

export interface Subscription {
  plan: string;
  validUntil: string;
  isActive: boolean;
}

export interface PaymentHistory {
  _id: string;
  amount: number;
  planName: string;
  status: string;
  paymentDate: string;
  validUntil: string;
}

export interface CheckoutSessionData {
  planName: string;
}

export interface VerifyPaymentData {
  sessionId: string;
}

const paymentService = {
  // Create checkout session
  createCheckoutSession: async (data: CheckoutSessionData): Promise<{ sessionId: string; url: string }> => {
    return api.post<{ sessionId: string; url: string }>("/payments/create-checkout-session", data);
  },
  
  // Verify payment
  verifyPayment: async (data: VerifyPaymentData): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>("/payments/verify", data);
  },
  
  // Get subscription status
  getSubscriptionStatus: async (): Promise<Subscription> => {
    return api.get<Subscription>("/payments/subscription");
  },
  
  // Get payment history
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    return api.get<PaymentHistory[]>("/payments/history");
  },
};

export default paymentService;
