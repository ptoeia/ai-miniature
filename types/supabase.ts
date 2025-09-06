export interface OneTimePurchase {
  id: string;
  profile_id: string;
  product_id: string;
  status: string;
  creem_payment_intent_id: string;
  created_at: string;
  updated_at: string;
  creem_product_id: string;
  creem_product?: {
    id: string;
    name: string;
  };
}

export interface Subscription {
  id: string;
  profile_id: string;
  product_id: string;
  status: string;
  creem_subscription_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  creem_product_id: string;
  creem_product?: {
    id: string;
    name: string;
  };
}

export interface Profile {
  id: string;
  credit_balance: number;
}

export interface CreemProduct {
  id: string;
  name: string;
  is_active: boolean;
  description: string | null;
  credit_cost: number;
  is_featured: boolean;
}

export interface UserPurchasesResponse {
  message?: string;
  subscriptions: Subscription[];
  oneTimePurchases: OneTimePurchase[];
  credits: number;
}
