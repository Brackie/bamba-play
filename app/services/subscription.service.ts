import type { ApiResponse } from "~/types/api";
import type {
  Subscription,
  SubscriptionStatusResponse,
  Transaction,
} from "~/types/subscription";
import apiClient, { createServerClient } from "~/lib/axios";
import {
  SUBSCRIPTIONS_STATUS_ROUTE,
  SUBSCRIPTIONS_SAFARICOM_ROUTE,
  SUBSCRIPTIONS_MPESA_ROUTE,
  SUBSCRIPTIONS_HISTORY_ROUTE,
  SUBSCRIPTIONS_TRANSACTIONS_ROUTE,
} from "~/lib/constants";

function getClient(cookieHeader?: string) {
  return cookieHeader ? createServerClient(cookieHeader) : apiClient;
}

export async function getSubscriptionStatus(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<SubscriptionStatusResponse>>(
    SUBSCRIPTIONS_STATUS_ROUTE
  );
  return res.data.data;
}

export async function initiateSafaricomSubscription(msisdn: string) {
  const res = await apiClient.post<ApiResponse<Subscription>>(
    SUBSCRIPTIONS_SAFARICOM_ROUTE,
    { msisdn }
  );
  return res.data.data;
}

export async function initiateMpesaSubscription(msisdn: string) {
  const res = await apiClient.post<ApiResponse<Subscription>>(
    SUBSCRIPTIONS_MPESA_ROUTE,
    { msisdn }
  );
  return res.data.data;
}

export async function getSubscriptionHistory(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<Subscription[]>>(
    SUBSCRIPTIONS_HISTORY_ROUTE
  );
  return res.data.data;
}

export async function getTransactionHistory(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<Transaction[]>>(
    SUBSCRIPTIONS_TRANSACTIONS_ROUTE
  );
  return res.data.data;
}
