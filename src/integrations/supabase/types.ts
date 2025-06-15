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
      bookings: {
        Row: {
          booking_type: string
          cancellation_reason: string | null
          cancelled_by: string | null
          client_id: string
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string | null
          end_time: string | null
          event_date: string
          event_type: string
          guest_count: number | null
          id: string
          payment_method: string | null
          payment_status: string | null
          payout_date: string | null
          payout_status: string | null
          refund_amount: number | null
          refund_approved_at: string | null
          refund_deadline: string | null
          refund_processed_at: string | null
          refund_reason: string | null
          refund_requested_at: string | null
          seller_amount: number | null
          service_provider_id: string | null
          special_requirements: string | null
          start_time: string | null
          status: string | null
          total_amount: number
          transaction_fee: number | null
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          booking_type: string
          cancellation_reason?: string | null
          cancelled_by?: string | null
          client_id: string
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          end_time?: string | null
          event_date: string
          event_type: string
          guest_count?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          payout_date?: string | null
          payout_status?: string | null
          refund_amount?: number | null
          refund_approved_at?: string | null
          refund_deadline?: string | null
          refund_processed_at?: string | null
          refund_reason?: string | null
          refund_requested_at?: string | null
          seller_amount?: number | null
          service_provider_id?: string | null
          special_requirements?: string | null
          start_time?: string | null
          status?: string | null
          total_amount: number
          transaction_fee?: number | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          booking_type?: string
          cancellation_reason?: string | null
          cancelled_by?: string | null
          client_id?: string
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          end_time?: string | null
          event_date?: string
          event_type?: string
          guest_count?: number | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          payout_date?: string | null
          payout_status?: string | null
          refund_amount?: number | null
          refund_approved_at?: string | null
          refund_deadline?: string | null
          refund_processed_at?: string | null
          refund_reason?: string | null
          refund_requested_at?: string | null
          seller_amount?: number | null
          service_provider_id?: string | null
          special_requirements?: string | null
          start_time?: string | null
          status?: string | null
          total_amount?: number
          transaction_fee?: number | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_requirements: {
        Row: {
          created_at: string | null
          entity_type: string
          id: string
          is_mandatory: boolean | null
          requirement_description: string | null
          requirement_name: string
          validation_rule: Json | null
        }
        Insert: {
          created_at?: string | null
          entity_type: string
          id?: string
          is_mandatory?: boolean | null
          requirement_description?: string | null
          requirement_name: string
          validation_rule?: Json | null
        }
        Update: {
          created_at?: string | null
          entity_type?: string
          id?: string
          is_mandatory?: boolean | null
          requirement_description?: string | null
          requirement_name?: string
          validation_rule?: Json | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          location: string | null
          payment_account_name: string | null
          payment_account_number: string | null
          payment_account_type: string | null
          phone: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          payment_account_name?: string | null
          payment_account_number?: string | null
          payment_account_type?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          payment_account_name?: string | null
          payment_account_number?: string | null
          payment_account_type?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewer_id: string
          service_provider_id: string | null
          venue_id: string | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewer_id: string
          service_provider_id?: string | null
          venue_id?: string | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewer_id?: string
          service_provider_id?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_provider_id_fkey"
            columns: ["service_provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          admin_verified: boolean | null
          admin_verified_at: string | null
          admin_verified_by: string | null
          bio: string | null
          blocked_dates: string[] | null
          booking_terms: Json | null
          certifications: string[] | null
          created_at: string | null
          cv_document_id: string | null
          documents_verified: boolean | null
          documents_verified_at: string | null
          documents_verified_by: string | null
          id: string
          is_available: boolean | null
          last_validated_at: string | null
          portfolio_images: string[] | null
          price_per_event: number
          rating: number | null
          response_time_hours: number | null
          resume_document_id: string | null
          security_validated: boolean | null
          service_category: string
          specialties: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
          validation_notes: string | null
          verification_completed_at: string | null
          verification_requested_at: string | null
          verification_score: number | null
          verification_status: string | null
          verification_token: string | null
          years_experience: number | null
        }
        Insert: {
          admin_verified?: boolean | null
          admin_verified_at?: string | null
          admin_verified_by?: string | null
          bio?: string | null
          blocked_dates?: string[] | null
          booking_terms?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          cv_document_id?: string | null
          documents_verified?: boolean | null
          documents_verified_at?: string | null
          documents_verified_by?: string | null
          id?: string
          is_available?: boolean | null
          last_validated_at?: string | null
          portfolio_images?: string[] | null
          price_per_event: number
          rating?: number | null
          response_time_hours?: number | null
          resume_document_id?: string | null
          security_validated?: boolean | null
          service_category: string
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
          validation_notes?: string | null
          verification_completed_at?: string | null
          verification_requested_at?: string | null
          verification_score?: number | null
          verification_status?: string | null
          verification_token?: string | null
          years_experience?: number | null
        }
        Update: {
          admin_verified?: boolean | null
          admin_verified_at?: string | null
          admin_verified_by?: string | null
          bio?: string | null
          blocked_dates?: string[] | null
          booking_terms?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          cv_document_id?: string | null
          documents_verified?: boolean | null
          documents_verified_at?: string | null
          documents_verified_by?: string | null
          id?: string
          is_available?: boolean | null
          last_validated_at?: string | null
          portfolio_images?: string[] | null
          price_per_event?: number
          rating?: number | null
          response_time_hours?: number | null
          resume_document_id?: string | null
          security_validated?: boolean | null
          service_category?: string
          specialties?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
          validation_notes?: string | null
          verification_completed_at?: string | null
          verification_requested_at?: string | null
          verification_score?: number | null
          verification_status?: string | null
          verification_token?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_cv_document_id_fkey"
            columns: ["cv_document_id"]
            isOneToOne: false
            referencedRelation: "user_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_providers_documents_verified_by_fkey"
            columns: ["documents_verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_providers_resume_document_id_fkey"
            columns: ["resume_document_id"]
            isOneToOne: false
            referencedRelation: "user_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          id: string
          mpesa_transaction_id: string | null
          original_transaction_id: string | null
          processed_at: string | null
          refund_amount: number | null
          status: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          mpesa_transaction_id?: string | null
          original_transaction_id?: string | null
          processed_at?: string | null
          refund_amount?: number | null
          status?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          mpesa_transaction_id?: string | null
          original_transaction_id?: string | null
          processed_at?: string | null
          refund_amount?: number | null
          status?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_original_transaction_id_fkey"
            columns: ["original_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          admin_notes: string | null
          admin_verified_at: string | null
          admin_verified_by: string | null
          created_at: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean | null
          mime_type: string | null
          updated_at: string | null
          upload_date: string | null
          user_id: string
          verified_by_admin: boolean | null
        }
        Insert: {
          admin_notes?: string | null
          admin_verified_at?: string | null
          admin_verified_by?: string | null
          created_at?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id: string
          verified_by_admin?: boolean | null
        }
        Update: {
          admin_notes?: string | null
          admin_verified_at?: string | null
          admin_verified_by?: string | null
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          updated_at?: string | null
          upload_date?: string | null
          user_id?: string
          verified_by_admin?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_admin_verified_by_fkey"
            columns: ["admin_verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      validation_logs: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          flagged_issues: string[] | null
          id: string
          security_score: number | null
          validated_by: string | null
          validation_result: Json
          validation_type: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          flagged_issues?: string[] | null
          id?: string
          security_score?: number | null
          validated_by?: string | null
          validation_result: Json
          validation_type: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          flagged_issues?: string[] | null
          id?: string
          security_score?: number | null
          validated_by?: string | null
          validation_result?: Json
          validation_type?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          admin_verified: boolean | null
          admin_verified_at: string | null
          admin_verified_by: string | null
          amenities: string[] | null
          blocked_dates: string[] | null
          booking_terms: Json | null
          capacity: number
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          last_validated_at: string | null
          location: string
          name: string
          owner_id: string
          price_per_day: number
          price_per_hour: number | null
          pricing_unit: string | null
          rating: number | null
          security_validated: boolean | null
          total_reviews: number | null
          updated_at: string | null
          validation_notes: string | null
          venue_type: string
          verification_completed_at: string | null
          verification_requested_at: string | null
          verification_score: number | null
          verification_status: string | null
          verification_token: string | null
        }
        Insert: {
          admin_verified?: boolean | null
          admin_verified_at?: string | null
          admin_verified_by?: string | null
          amenities?: string[] | null
          blocked_dates?: string[] | null
          booking_terms?: Json | null
          capacity: number
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          last_validated_at?: string | null
          location: string
          name: string
          owner_id: string
          price_per_day: number
          price_per_hour?: number | null
          pricing_unit?: string | null
          rating?: number | null
          security_validated?: boolean | null
          total_reviews?: number | null
          updated_at?: string | null
          validation_notes?: string | null
          venue_type: string
          verification_completed_at?: string | null
          verification_requested_at?: string | null
          verification_score?: number | null
          verification_status?: string | null
          verification_token?: string | null
        }
        Update: {
          admin_verified?: boolean | null
          admin_verified_at?: string | null
          admin_verified_by?: string | null
          amenities?: string[] | null
          blocked_dates?: string[] | null
          booking_terms?: Json | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          last_validated_at?: string | null
          location?: string
          name?: string
          owner_id?: string
          price_per_day?: number
          price_per_hour?: number | null
          pricing_unit?: string | null
          rating?: number | null
          security_validated?: boolean | null
          total_reviews?: number | null
          updated_at?: string | null
          validation_notes?: string | null
          venue_type?: string
          verification_completed_at?: string | null
          verification_requested_at?: string | null
          verification_score?: number | null
          verification_status?: string | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          requested_at: string | null
          status: string | null
          user_id: string
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          requested_at?: string | null
          status?: string | null
          user_id: string
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          requested_at?: string | null
          status?: string | null
          user_id?: string
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_payment_breakdown: {
        Args: {
          booking_amount: number
          commission_rate?: number
          transaction_fee_rate?: number
        }
        Returns: Json
      }
      calculate_refund_amount: {
        Args: { booking_amount: number; transaction_fee_rate?: number }
        Returns: Json
      }
      generate_verification_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_public_documents: {
        Args: { target_user_id: string }
        Returns: {
          id: string
          document_type: string
          file_name: string
          upload_date: string
          verified_by_admin: boolean
          admin_notes: string
        }[]
      }
      initiate_verification: {
        Args: { p_entity_type: string; p_entity_id: string; p_user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_automatic_payout: {
        Args: { booking_uuid: string }
        Returns: boolean
      }
      process_listing_verification: {
        Args: { p_entity_type: string; p_entity_id: string }
        Returns: boolean
      }
      process_refund: {
        Args: {
          booking_uuid: string
          refund_reason?: string
          cancelled_by_user_id?: string
        }
        Returns: boolean
      }
      validate_listing_data: {
        Args: { p_entity_type: string; p_entity_id: string; p_data: Json }
        Returns: Json
      }
      verify_listing: {
        Args: { p_token: string }
        Returns: boolean
      }
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
