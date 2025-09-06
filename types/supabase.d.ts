import { Database } from '@/lib/database.types';

export type Tables = Database['public']['Tables'];

export type OneTimePurchase = Tables['one_time_purchases']['Row'];
export type Subscription = Tables['subscription']['Row'];
export type Profile = Tables['profiles']['Row'];
export type CreemProduct = Tables['CreemProduct']['Row'];

export interface UserPurchasesResponse {
  message?: string;
  subscriptions: {
    id: string;
    product: string;
    providerCustomerId: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  oneTimePurchases: {
    id: string;
    product: string;
    providerCustomerId: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  credits: number;
}

export interface SubscriptionWithProduct extends Subscription {
  CreemProduct?: CreemProduct | null;
}

export interface OneTimePurchaseWithProduct extends OneTimePurchase {
  CreemProduct?: CreemProduct | null;
}
