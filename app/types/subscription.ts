export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export type PaymentMethod = "safaricom_mobile" | "mpesa_daraja";

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  msisdn: string | null;
  externalReference: string | null;
  startsAt: string;
  endsAt: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  subscriptionId: string | null;
  paymentMethod: PaymentMethod;
  externalTransactionId: string | null;
  amount: number;
  currency: string;
  status: string;
  msisdn: string | null;
  providerResponse: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface SubscriptionStatusResponse {
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
}
