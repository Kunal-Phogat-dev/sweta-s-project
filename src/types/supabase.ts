export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      business_users: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          created_at: string | null
          gst_number: string | null
          gst_registered: boolean | null
          id: string
          name: string
          owner_name: string
          phone: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          gst_number?: string | null
          gst_registered?: boolean | null
          id?: string
          name: string
          owner_name: string
          phone: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          gst_number?: string | null
          gst_registered?: boolean | null
          id?: string
          name?: string
          owner_name?: string
          phone?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cashbook_entries: {
        Row: {
          amount: number
          business_id: string | null
          category: string
          created_at: string | null
          date: string
          deleted_at: string | null
          id: string
          linked_contact_id: string | null
          linked_purchase_id: string | null
          linked_sale_id: string | null
          mode: Database["public"]["Enums"]["cashbook_mode"]
          note: string | null
          type: Database["public"]["Enums"]["cashbook_type"]
        }
        Insert: {
          amount: number
          business_id?: string | null
          category: string
          created_at?: string | null
          date: string
          deleted_at?: string | null
          id?: string
          linked_contact_id?: string | null
          linked_purchase_id?: string | null
          linked_sale_id?: string | null
          mode: Database["public"]["Enums"]["cashbook_mode"]
          note?: string | null
          type: Database["public"]["Enums"]["cashbook_type"]
        }
        Update: {
          amount?: number
          business_id?: string | null
          category?: string
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          id?: string
          linked_contact_id?: string | null
          linked_purchase_id?: string | null
          linked_sale_id?: string | null
          mode?: Database["public"]["Enums"]["cashbook_mode"]
          note?: string | null
          type?: Database["public"]["Enums"]["cashbook_type"]
        }
        Relationships: [
          {
            foreignKeyName: "cashbook_entries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashbook_entries_linked_contact_id_fkey"
            columns: ["linked_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashbook_entries_linked_purchase_id_fkey"
            columns: ["linked_purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashbook_entries_linked_sale_id_fkey"
            columns: ["linked_sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          business_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          opening_balance: number | null
          opening_balance_type: Database["public"]["Enums"]["balance_type"]
          phone: string | null
          type: Database["public"]["Enums"]["contact_type"]
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          opening_balance?: number | null
          opening_balance_type: Database["public"]["Enums"]["balance_type"]
          phone?: string | null
          type: Database["public"]["Enums"]["contact_type"]
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          opening_balance?: number | null
          opening_balance_type?: Database["public"]["Enums"]["balance_type"]
          phone?: string | null
          type?: Database["public"]["Enums"]["contact_type"]
        }
        Relationships: [
          {
            foreignKeyName: "contacts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          business_id: string | null
          category: string
          created_at: string | null
          date: string
          deleted_at: string | null
          id: string
          mode: Database["public"]["Enums"]["cashbook_mode"]
          note: string | null
        }
        Insert: {
          amount: number
          business_id?: string | null
          category: string
          created_at?: string | null
          date: string
          deleted_at?: string | null
          id?: string
          mode: Database["public"]["Enums"]["cashbook_mode"]
          note?: string | null
        }
        Update: {
          amount?: number
          business_id?: string | null
          category?: string
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["cashbook_mode"]
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          business_id: string | null
          created_at: string | null
          email: string
          id: string
          role: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          role: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          business_id: string | null
          created_at: string | null
          current_stock: number | null
          gst_rate: number | null
          id: string
          low_stock_threshold: number | null
          name: string
          purchase_price: number
          sale_price: number
          unit: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          current_stock?: number | null
          gst_rate?: number | null
          id?: string
          low_stock_threshold?: number | null
          name: string
          purchase_price: number
          sale_price: number
          unit: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          current_stock?: number | null
          gst_rate?: number | null
          id?: string
          low_stock_threshold?: number | null
          name?: string
          purchase_price?: number
          sale_price?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          description: string | null
          gst_rate: number | null
          id: string
          item_id: string | null
          line_total: number
          purchase_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          description?: string | null
          gst_rate?: number | null
          id?: string
          item_id?: string | null
          line_total: number
          purchase_id?: string | null
          quantity: number
          unit_price: number
        }
        Update: {
          description?: string | null
          gst_rate?: number | null
          id?: string
          item_id?: string | null
          line_total?: number
          purchase_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          amount_paid: number
          bill_number: string
          business_id: string | null
          contact_id: string | null
          created_at: string | null
          date: string
          deleted_at: string | null
          gst_amount: number
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          total: number
        }
        Insert: {
          amount_paid: number
          bill_number: string
          business_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          date: string
          deleted_at?: string | null
          gst_amount: number
          id?: string
          status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          total: number
        }
        Update: {
          amount_paid?: number
          bill_number?: string
          business_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          gst_amount?: number
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchases_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          description: string | null
          gst_rate: number | null
          id: string
          item_id: string | null
          line_total: number
          quantity: number
          sale_id: string | null
          unit_price: number
        }
        Insert: {
          description?: string | null
          gst_rate?: number | null
          id?: string
          item_id?: string | null
          line_total: number
          quantity: number
          sale_id?: string | null
          unit_price: number
        }
        Update: {
          description?: string | null
          gst_rate?: number | null
          id?: string
          item_id?: string | null
          line_total?: number
          quantity?: number
          sale_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount_paid: number
          business_id: string | null
          contact_id: string | null
          created_at: string | null
          date: string
          deleted_at: string | null
          gst_amount: number
          id: string
          invoice_number: string
          status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          total: number
        }
        Insert: {
          amount_paid: number
          business_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          date: string
          deleted_at?: string | null
          gst_amount: number
          id?: string
          invoice_number: string
          status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          total: number
        }
        Update: {
          amount_paid?: number
          business_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          date?: string
          deleted_at?: string | null
          gst_amount?: number
          id?: string
          invoice_number?: string
          status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      balance_type: "receivable" | "payable"
      cashbook_mode: "cash" | "bank"
      cashbook_type: "in" | "out"
      contact_type: "customer" | "supplier" | "both"
      payment_status: "paid" | "partial" | "credit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      balance_type: ["receivable", "payable"],
      cashbook_mode: ["cash", "bank"],
      cashbook_type: ["in", "out"],
      contact_type: ["customer", "supplier", "both"],
      payment_status: ["paid", "partial", "credit"],
    },
  },
} as const
