export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_services: {
        Row: {
          id: string
          name: string
          description: string | null
          credit_cost: number
          unit_name: string | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          credit_cost: number
          unit_name?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          credit_cost?: number
          unit_name?: string | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          transaction_type: string
          amount: number
          description: string | null
          related_ai_service_id: string | null
          related_creem_charge_id: string | null
          metadata: Json | null
          created_at: string | null
          related_creem_product_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          transaction_type: string
          amount: number
          description?: string | null
          related_ai_service_id?: string | null
          related_creem_charge_id?: string | null
          metadata?: Json | null
          created_at?: string | null
          related_creem_product_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          transaction_type?: string
          amount?: number
          description?: string | null
          related_ai_service_id?: string | null
          related_creem_charge_id?: string | null
          metadata?: Json | null
          created_at?: string | null
          related_creem_product_id?: string | null
        }
      }
      one_time_purchases: {
        Row: {
          id: string
          profile_id: string
          status: string
          creem_payment_intent_id: string
          created_at: string
          updated_at: string
          product_id: string
        }
        Insert: {
          id: string
          profile_id: string
          status: string
          creem_payment_intent_id: string
          created_at?: string
          updated_at?: string
          product_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          status?: string
          creem_payment_intent_id?: string
          created_at?: string
          updated_at?: string
          product_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          fullName: string | null
          avatarUrl: string | null
          credit_balance: number
          creem_customer_id: string | null
          country: string | null
          created_at: string
          updated_at: string
          free_trial_credits_granted: boolean
        }
        Insert: {
          id: string
          email?: string | null
          fullName?: string | null
          avatarUrl?: string | null
          credit_balance?: number
          creem_customer_id?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
          free_trial_credits_granted?: boolean
        }
        Update: {
          id?: string
          email?: string | null
          fullName?: string | null
          avatarUrl?: string | null
          credit_balance?: number
          creem_customer_id?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
          free_trial_credits_granted?: boolean
        }
      }
      CreemProduct: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          creemId: string
          active: boolean
          createdAt: string
          updatedAt: string
          plan_tier: string | null
          billing_period: string | null
          grants_credits: number | null
          display_credits_per_month: number | null
          interval: string | null
          interval_count: number | null
          is_popular: boolean | null
          features: Json | null
          button_text: string | null
          display_order: number
          is_featured: boolean
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          price: number
          currency: string
          creemId: string
          active?: boolean
          createdAt?: string
          updatedAt?: string
          plan_tier?: string | null
          billing_period?: string | null
          grants_credits?: number | null
          display_credits_per_month?: number | null
          interval?: string | null
          interval_count?: number | null
          is_popular?: boolean | null
          features?: Json | null
          button_text?: string | null
          display_order: number
          is_featured: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          creemId?: string
          active?: boolean
          createdAt?: string
          updatedAt?: string
          plan_tier?: string | null
          billing_period?: string | null
          grants_credits?: number | null
          display_credits_per_month?: number | null
          interval?: string | null
          interval_count?: number | null
          is_popular?: boolean | null
          features?: Json | null
          button_text?: string | null
          display_order?: number
          is_featured?: boolean
        }
      }
      subscription: {
        Row: {
          id: string
          profileId: string
          status: string
          creemSubscriptionId: string
          currentPeriodStart: string
          currentPeriodEnd: string
          cancelAtPeriodEnd: boolean
          canceledAt: string | null
          endedAt: string | null
          createdAt: string
          updatedAt: string
          product_id: string
        }
        Insert: {
          id: string
          profileId: string
          status: string
          creemSubscriptionId: string
          currentPeriodStart: string
          currentPeriodEnd: string
          cancelAtPeriodEnd?: boolean
          canceledAt?: string | null
          endedAt?: string | null
          createdAt?: string
          updatedAt?: string
          product_id: string
        }
        Update: {
          id?: string
          profileId?: string
          status?: string
          creemSubscriptionId?: string
          currentPeriodStart?: string
          currentPeriodEnd?: string
          cancelAtPeriodEnd?: boolean
          canceledAt?: string | null
          endedAt?: string | null
          createdAt?: string
          updatedAt?: string
          product_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

