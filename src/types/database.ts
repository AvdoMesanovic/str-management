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
      access_code: {
        Row: {
          archived_at: string | null
          booking_id: string | null
          code: string
          created_at: string
          guest_name: string
          id: string
          property_id: string
          status: Database["public"]["Enums"]["access_code_status"]
          type: Database["public"]["Enums"]["access_code_type"]
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          archived_at?: string | null
          booking_id?: string | null
          code: string
          created_at?: string
          guest_name: string
          id?: string
          property_id: string
          status?: Database["public"]["Enums"]["access_code_status"]
          type?: Database["public"]["Enums"]["access_code_type"]
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          archived_at?: string | null
          booking_id?: string | null
          code?: string
          created_at?: string
          guest_name?: string
          id?: string
          property_id?: string
          status?: Database["public"]["Enums"]["access_code_status"]
          type?: Database["public"]["Enums"]["access_code_type"]
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_code_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_code_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          message: string
          occurred_at: string
          property_id: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          occurred_at?: string
          property_id: string
          type: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          occurred_at?: string
          property_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      booking: {
        Row: {
          archived_at: string | null
          check_in: string
          check_out: string
          created_at: string
          external_id: string | null
          guest_count: number
          guest_id: string
          id: string
          notes: string
          property_id: string
          source: Database["public"]["Enums"]["booking_source"]
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          check_in: string
          check_out: string
          created_at?: string
          external_id?: string | null
          guest_count?: number
          guest_id: string
          id?: string
          notes?: string
          property_id: string
          source?: Database["public"]["Enums"]["booking_source"]
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          external_id?: string | null
          guest_count?: number
          guest_id?: string
          id?: string
          notes?: string
          property_id?: string
          source?: Database["public"]["Enums"]["booking_source"]
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      client: {
        Row: {
          archived_at: string | null
          created_at: string
          email: string
          id: string
          join_date: string
          name: string
          notes: string
          phone: string
          preferred_contact: Database["public"]["Enums"]["preferred_contact"]
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          email: string
          id?: string
          join_date?: string
          name: string
          notes?: string
          phone: string
          preferred_contact?: Database["public"]["Enums"]["preferred_contact"]
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          email?: string
          id?: string
          join_date?: string
          name?: string
          notes?: string
          phone?: string
          preferred_contact?: Database["public"]["Enums"]["preferred_contact"]
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Relationships: []
      }
      financial_period: {
        Row: {
          created_at: string
          gross_rent: number
          id: string
          monthly_roi: number | null
          period_month: number
          period_year: number
          property_id: string
          remittance_days: number | null
          remittance_period: string | null
          tax_liability: number
          tax_readiness: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          gross_rent?: number
          id?: string
          monthly_roi?: number | null
          period_month: number
          period_year: number
          property_id: string
          remittance_days?: number | null
          remittance_period?: string | null
          tax_liability?: number
          tax_readiness?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          gross_rent?: number
          id?: string
          monthly_roi?: number | null
          period_month?: number
          period_year?: number
          property_id?: string
          remittance_days?: number | null
          remittance_period?: string | null
          tax_liability?: number
          tax_readiness?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_period_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      guest: {
        Row: {
          archived_at: string | null
          created_at: string
          email: string | null
          id: string
          is_flagged: boolean
          name: string
          notes: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_flagged?: boolean
          name: string
          notes?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_flagged?: boolean
          name?: string
          notes?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      market_event: {
        Row: {
          archived_at: string | null
          created_at: string
          date_end: string | null
          date_start: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          date_end?: string | null
          date_start: string
          description?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      property: {
        Row: {
          address: string
          alarm_battery_level: number
          alarm_last_tested: string | null
          archived_at: string | null
          avg_temp_adj: number
          bathrooms: number
          bedrooms: number
          client_id: string
          compliance_progress: number
          created_at: string
          empty_temp: number
          id: string
          leak_status: Database["public"]["Enums"]["leak_status"]
          listing_active: boolean
          listing_description: string
          listing_photo_count: number
          lock_status: Database["public"]["Enums"]["lock_status"]
          main_valve: Database["public"]["Enums"]["valve_status"]
          monthly_savings: number | null
          name: string
          occupied_temp: number
          pricelabs_synced: boolean
          risk_level: Database["public"]["Enums"]["risk_level"]
          risk_reason: string
          safety_score: number
          sms_enabled: boolean
          updated_at: string
        }
        Insert: {
          address: string
          alarm_battery_level?: number
          alarm_last_tested?: string | null
          archived_at?: string | null
          avg_temp_adj?: number
          bathrooms?: number
          bedrooms?: number
          client_id: string
          compliance_progress?: number
          created_at?: string
          empty_temp?: number
          id?: string
          leak_status?: Database["public"]["Enums"]["leak_status"]
          listing_active?: boolean
          listing_description?: string
          listing_photo_count?: number
          lock_status?: Database["public"]["Enums"]["lock_status"]
          main_valve?: Database["public"]["Enums"]["valve_status"]
          monthly_savings?: number | null
          name: string
          occupied_temp?: number
          pricelabs_synced?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_reason?: string
          safety_score?: number
          sms_enabled?: boolean
          updated_at?: string
        }
        Update: {
          address?: string
          alarm_battery_level?: number
          alarm_last_tested?: string | null
          archived_at?: string | null
          avg_temp_adj?: number
          bathrooms?: number
          bedrooms?: number
          client_id?: string
          compliance_progress?: number
          created_at?: string
          empty_temp?: number
          id?: string
          leak_status?: Database["public"]["Enums"]["leak_status"]
          listing_active?: boolean
          listing_description?: string
          listing_photo_count?: number
          lock_status?: Database["public"]["Enums"]["lock_status"]
          main_valve?: Database["public"]["Enums"]["valve_status"]
          monthly_savings?: number | null
          name?: string
          occupied_temp?: number
          pricelabs_synced?: boolean
          risk_level?: Database["public"]["Enums"]["risk_level"]
          risk_reason?: string
          safety_score?: number
          sms_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["id"]
          },
        ]
      }
      property_event: {
        Row: {
          created_at: string
          event_id: string
          id: string
          manual_override: boolean
          pricing_notes: string | null
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          manual_override?: boolean
          pricing_notes?: string | null
          property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          manual_override?: boolean
          pricing_notes?: string | null
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_event_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "market_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_event_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_alert: {
        Row: {
          actual_value: number
          booking_id: string | null
          created_at: string
          id: string
          message: string
          property_id: string
          resolved_at: string | null
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          severity: Database["public"]["Enums"]["alert_severity"]
          threshold_value: number
          triggered_at: string
        }
        Insert: {
          actual_value: number
          booking_id?: string | null
          created_at?: string
          id?: string
          message: string
          property_id: string
          resolved_at?: string | null
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          severity: Database["public"]["Enums"]["alert_severity"]
          threshold_value: number
          triggered_at?: string
        }
        Update: {
          actual_value?: number
          booking_id?: string | null
          created_at?: string
          id?: string
          message?: string
          property_id?: string
          resolved_at?: string | null
          sensor_type?: Database["public"]["Enums"]["sensor_type"]
          severity?: Database["public"]["Enums"]["alert_severity"]
          threshold_value?: number
          triggered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensor_alert_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sensor_alert_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_snapshot: {
        Row: {
          id: string
          property_id: string
          recorded_at: string
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          value: number
        }
        Insert: {
          id?: string
          property_id: string
          recorded_at?: string
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          value: number
        }
        Update: {
          id?: string
          property_id?: string
          recorded_at?: string
          sensor_type?: Database["public"]["Enums"]["sensor_type"]
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_snapshot_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
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
      access_code_status: "active" | "expired" | "revoked"
      access_code_type: "guest" | "cleaner" | "maintenance" | "owner"
      activity_type: "automated" | "manual" | "alert"
      alert_severity: "warning" | "critical"
      booking_source: "hospitable" | "direct" | "airbnb" | "vrbo"
      booking_status: "confirmed" | "checked_in" | "checked_out" | "cancelled"
      client_status: "active" | "pending" | "inactive"
      leak_status: "clear" | "critical"
      lock_status: "online" | "offline"
      preferred_contact: "email" | "phone" | "text"
      risk_level: "low" | "medium" | "high" | "critical"
      sensor_type:
        | "noise_db"
        | "temperature"
        | "lock_heartbeat"
        | "utility_usage"
      valve_status: "open" | "closed"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      access_code_status: ["active", "expired", "revoked"],
      access_code_type: ["guest", "cleaner", "maintenance", "owner"],
      activity_type: ["automated", "manual", "alert"],
      alert_severity: ["warning", "critical"],
      booking_source: ["hospitable", "direct", "airbnb", "vrbo"],
      booking_status: ["confirmed", "checked_in", "checked_out", "cancelled"],
      client_status: ["active", "pending", "inactive"],
      leak_status: ["clear", "critical"],
      lock_status: ["online", "offline"],
      preferred_contact: ["email", "phone", "text"],
      risk_level: ["low", "medium", "high", "critical"],
      sensor_type: [
        "noise_db",
        "temperature",
        "lock_heartbeat",
        "utility_usage",
      ],
      valve_status: ["open", "closed"],
    },
  },
} as const
