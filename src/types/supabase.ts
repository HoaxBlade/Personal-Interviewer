export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      interview_questions: {
        Row: {
          ai_feedback: string | null
          created_at: string
          difficulty: string | null
          expected_answer: string | null
          id: string
          order_index: number
          question_text: string
          question_type: string | null
          score: number | null
          session_id: string
          time_taken_seconds: number | null
          user_answer: string | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          difficulty?: string | null
          expected_answer?: string | null
          id?: string
          order_index: number
          question_text: string
          question_type?: string | null
          score?: number | null
          session_id: string
          time_taken_seconds?: number | null
          user_answer?: string | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          difficulty?: string | null
          expected_answer?: string | null
          id?: string
          order_index?: number
          question_text?: string
          question_type?: string | null
          score?: number | null
          session_id?: string
          time_taken_seconds?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_sessions: {
        Row: {
          company_name: string | null
          completed_at: string | null
          created_at: string
          difficulty_level: string | null
          duration_minutes: number | null
          feedback_summary: string | null
          id: string
          job_position: string | null
          score: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string | null
          duration_minutes?: number | null
          feedback_summary?: string | null
          id?: string
          job_position?: string | null
          score?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string | null
          duration_minutes?: number | null
          feedback_summary?: string | null
          id?: string
          job_position?: string | null
          score?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      question_bank: {
        Row: {
          created_at: string
          difficulty: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          job_role: string | null
          question_text: string
          question_type: string | null
          sample_answer: string | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          job_role?: string | null
          question_text: string
          question_type?: string | null
          sample_answer?: string | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          job_role?: string | null
          question_text?: string
          question_type?: string | null
          sample_answer?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: string[]
          id: string
          is_active: boolean | null
          max_interviews_per_month: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features: string[]
          id?: string
          is_active?: boolean | null
          max_interviews_per_month?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean | null
          max_interviews_per_month?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          feedback_type: string | null
          id: string
          rating: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          feedback_type?: string | null
          id?: string
          rating?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          feedback_type?: string | null
          id?: string
          rating?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          areas_for_improvement: string[] | null
          average_score: number | null
          completed_interviews: number | null
          created_at: string
          id: string
          improvement_percentage: number | null
          last_interview_date: string | null
          strengths: string[] | null
          total_interviews: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          areas_for_improvement?: string[] | null
          average_score?: number | null
          completed_interviews?: number | null
          created_at?: string
          id?: string
          improvement_percentage?: number | null
          last_interview_date?: string | null
          strengths?: string[] | null
          total_interviews?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          areas_for_improvement?: string[] | null
          average_score?: number | null
          completed_interviews?: number | null
          created_at?: string
          id?: string
          improvement_percentage?: number | null
          last_interview_date?: string | null
          strengths?: string[] | null
          total_interviews?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          interviews_used_this_month: number | null
          plan_id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          interviews_used_this_month?: number | null
          plan_id: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          interviews_used_this_month?: number | null
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
  public: {
    Enums: {},
  },
} as const
