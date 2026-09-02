export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      leads: {
        Row: {
          accessibility: string | null;
          assigned_user: string | null;
          business_type: string | null;
          city: string | null;
          company_name: string | null;
          consent: boolean | null;
          contact_name: string | null;
          created_at: string;
          duct_length: string | null;
          duct_present: boolean | null;
          email: string | null;
          filter_count: number | null;
          hood_length: string | null;
          hood_type: string | null;
          id: string;
          installation_type: string | null;
          landing_page: string | null;
          last_cleaning: string | null;
          last_intervention_at: string | null;
          maintenance_frequency: string | null;
          message: string | null;
          motor_present: boolean | null;
          need_type: string | null;
          next_action: string | null;
          next_due_at: string | null;
          night_intervention: boolean | null;
          notes: string | null;
          phone: string | null;
          photos: Json;
          postal_code: string | null;
          preferred_contact: string | null;
          priority: string | null;
          reference: string | null;
          request_type: string | null;
          requested_frequency: string | null;
          schedule_preference: string | null;
          service_source: string | null;
          soil_level: string | null;
          source: string;
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
          urgency_level: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          zone_source: string | null;
        };
        Insert: {
          assigned_user?: string | null;
          business_type?: string | null;
          city?: string | null;
          company_name?: string | null;
          consent?: boolean | null;
          contact_name?: string | null;
          created_at?: string;
          duct_present?: boolean | null;
          email?: string | null;
          filter_count?: number | null;
          hood_length?: string | null;
          id?: string;
          last_cleaning?: string | null;
          message?: string | null;
          motor_present?: boolean | null;
          notes?: string | null;
          phone?: string | null;
          photos?: Json;
          postal_code?: string | null;
          preferred_contact?: string | null;
          priority?: string | null;
          reference?: string | null;
          requested_frequency?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          assigned_user?: string | null;
          business_type?: string | null;
          city?: string | null;
          company_name?: string | null;
          consent?: boolean | null;
          contact_name?: string | null;
          created_at?: string;
          duct_present?: boolean | null;
          email?: string | null;
          filter_count?: number | null;
          hood_length?: string | null;
          id?: string;
          last_cleaning?: string | null;
          message?: string | null;
          motor_present?: boolean | null;
          notes?: string | null;
          phone?: string | null;
          photos?: Json;
          postal_code?: string | null;
          preferred_contact?: string | null;
          priority?: string | null;
          reference?: string | null;
          requested_frequency?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      staff_profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          role: Database["public"]["Enums"]["staff_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          role?: Database["public"]["Enums"]["staff_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          role?: Database["public"]["Enums"]["staff_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status:
        "new" | "contacted" | "qualified" | "quote_requested" | "quote_sent" | "won" | "lost";
      staff_role: "admin" | "commercial";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "quote_requested",
        "quote_sent",
        "won",
        "lost",
      ],
      staff_role: ["admin", "commercial"],
    },
  },
} as const;
