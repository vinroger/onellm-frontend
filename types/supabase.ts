export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      data_points: {
        Row: {
          created_at: string | null;
          data: Json;
          dataset_id: string | null;
          id: string;
          owner_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          data: Json;
          dataset_id?: string | null;
          id: string;
          owner_id: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          data?: Json;
          dataset_id?: string | null;
          id?: string;
          owner_id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "data_points_dataset_id_fkey";
            columns: ["dataset_id"];
            isOneToOne: false;
            referencedRelation: "datasets";
            referencedColumns: ["id"];
          },
        ];
      };
      datasets: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          integration_id: string | null;
          name: string;
          owner_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id: string;
          integration_id?: string | null;
          name: string;
          owner_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          integration_id?: string | null;
          name?: string;
          owner_id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      evaluation_models: {
        Row: {
          evaluation_id: string;
          model_id: string;
        };
        Insert: {
          evaluation_id: string;
          model_id: string;
        };
        Update: {
          evaluation_id?: string;
          model_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "evaluation_models_evaluation_id_fkey";
            columns: ["evaluation_id"];
            isOneToOne: false;
            referencedRelation: "evaluations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "evaluation_models_model_id_fkey";
            columns: ["model_id"];
            isOneToOne: false;
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
        ];
      };
      evaluation_points: {
        Row: {
          comment: string | null;
          created_at: string | null;
          data: Json | null;
          data_point_id: string | null;
          evaluation_id: string | null;
          id: string;
          owner_id: string;
          score: number | null;
          updated_at: string | null;
        };
        Insert: {
          comment?: string | null;
          created_at?: string | null;
          data?: Json | null;
          data_point_id?: string | null;
          evaluation_id?: string | null;
          id: string;
          owner_id: string;
          score?: number | null;
          updated_at?: string | null;
        };
        Update: {
          comment?: string | null;
          created_at?: string | null;
          data?: Json | null;
          data_point_id?: string | null;
          evaluation_id?: string | null;
          id?: string;
          owner_id?: string;
          score?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "evaluation_points_data_point_id_fkey";
            columns: ["data_point_id"];
            isOneToOne: false;
            referencedRelation: "data_points";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "evaluation_points_evaluation_id_fkey";
            columns: ["evaluation_id"];
            isOneToOne: false;
            referencedRelation: "evaluations";
            referencedColumns: ["id"];
          },
        ];
      };
      evaluation_tags: {
        Row: {
          evaluation_id: string;
          tag_id: number;
        };
        Insert: {
          evaluation_id: string;
          tag_id: number;
        };
        Update: {
          evaluation_id?: string;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "evaluation_tags_evaluation_id_fkey";
            columns: ["evaluation_id"];
            isOneToOne: false;
            referencedRelation: "evaluations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "evaluation_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      evaluations: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          owner_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id: string;
          owner_id: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          owner_id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      log_tags: {
        Row: {
          log_id: number;
          tag_id: number;
        };
        Insert: {
          log_id: number;
          tag_id: number;
        };
        Update: {
          log_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "log_tags_log_id_fkey";
            columns: ["log_id"];
            isOneToOne: false;
            referencedRelation: "logs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "log_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      logs: {
        Row: {
          api: string | null;
          chat: Json | null;
          completion_token: number | null;
          created_at: string | null;
          id: number;
          ip_address: string | null;
          owner_id: string;
          prompt_tokens: number | null;
          provider: string | null;
          type: string | null;
        };
        Insert: {
          api?: string | null;
          chat?: Json | null;
          completion_token?: number | null;
          created_at?: string | null;
          id?: number;
          ip_address?: string | null;
          owner_id: string;
          prompt_tokens?: number | null;
          provider?: string | null;
          type?: string | null;
        };
        Update: {
          api?: string | null;
          chat?: Json | null;
          completion_token?: number | null;
          created_at?: string | null;
          id?: number;
          ip_address?: string | null;
          owner_id?: string;
          prompt_tokens?: number | null;
          provider?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      models: {
        Row: {
          api_key: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          initial_prompt: Json | null;
          integration_id: string | null;
          name: string;
          owner_id: string;
          provider: string | null;
          updated_at: string | null;
          version_id: string | null;
        };
        Insert: {
          api_key?: string | null;
          created_at?: string | null;
          description?: string | null;
          id: string;
          initial_prompt?: Json | null;
          integration_id?: string | null;
          name: string;
          owner_id: string;
          provider?: string | null;
          updated_at?: string | null;
          version_id?: string | null;
        };
        Update: {
          api_key?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          initial_prompt?: Json | null;
          integration_id?: string | null;
          name?: string;
          owner_id?: string;
          provider?: string | null;
          updated_at?: string | null;
          version_id?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          owner_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          owner_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          owner_id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      trainings: {
        Row: {
          base_model_id: string | null;
          created_at: string | null;
          data: Json | null;
          dataset_id: string | null;
          description: string | null;
          id: string;
          integration_id: string | null;
          owner_id: string;
          result_model_id: string | null;
          status: string | null;
          title: string;
          training_completed_at: string | null;
          training_started_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          base_model_id?: string | null;
          created_at?: string | null;
          data?: Json | null;
          dataset_id?: string | null;
          description?: string | null;
          id: string;
          integration_id?: string | null;
          owner_id: string;
          result_model_id?: string | null;
          status?: string | null;
          title: string;
          training_completed_at?: string | null;
          training_started_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          base_model_id?: string | null;
          created_at?: string | null;
          data?: Json | null;
          dataset_id?: string | null;
          description?: string | null;
          id?: string;
          integration_id?: string | null;
          owner_id?: string;
          result_model_id?: string | null;
          status?: string | null;
          title?: string;
          training_completed_at?: string | null;
          training_started_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trainings_base_model_id_fkey";
            columns: ["base_model_id"];
            isOneToOne: false;
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trainings_dataset_id_fkey";
            columns: ["dataset_id"];
            isOneToOne: false;
            referencedRelation: "datasets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trainings_result_model_id_fkey";
            columns: ["result_model_id"];
            isOneToOne: false;
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
