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
          {
            foreignKeyName: "public_data_points_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
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
          project_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id: string;
          integration_id?: string | null;
          name: string;
          owner_id: string;
          project_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          integration_id?: string | null;
          name?: string;
          owner_id?: string;
          project_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_datasets_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_datasets_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
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
            foreignKeyName: "public_evaluation_models_model_id_fkey";
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
          project_id: string | null;
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
          project_id?: string | null;
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
          project_id?: string | null;
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
          {
            foreignKeyName: "public_evaluation_points_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_evaluation_points_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
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
          dataset_id: string | null;
          description: string | null;
          id: string;
          owner_id: string;
          project_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          dataset_id?: string | null;
          description?: string | null;
          id: string;
          owner_id: string;
          project_id: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          dataset_id?: string | null;
          description?: string | null;
          id?: string;
          owner_id?: string;
          project_id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_evaluations_dataset_id_fkey";
            columns: ["dataset_id"];
            isOneToOne: false;
            referencedRelation: "datasets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_evaluations_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_evaluations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      files: {
        Row: {
          cloud_provider: string | null;
          created_at: string;
          data: Json | null;
          id: string;
          link: string | null;
          owner_id: string | null;
          project_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          cloud_provider?: string | null;
          created_at?: string;
          data?: Json | null;
          id: string;
          link?: string | null;
          owner_id?: string | null;
          project_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          cloud_provider?: string | null;
          created_at?: string;
          data?: Json | null;
          id?: string;
          link?: string | null;
          owner_id?: string | null;
          project_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_files_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_files_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      keys: {
        Row: {
          created_at: string;
          id: string;
          key: string | null;
          last_used: string | null;
          name: string | null;
          owner_id: string | null;
          project_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          key?: string | null;
          last_used?: string | null;
          name?: string | null;
          owner_id?: string | null;
          project_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          key?: string | null;
          last_used?: string | null;
          name?: string | null;
          owner_id?: string | null;
          project_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_keys_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_keys_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      log_tags: {
        Row: {
          log_id: string;
          tag_id: number;
        };
        Insert: {
          log_id: string;
          tag_id?: number;
        };
        Update: {
          log_id?: string;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_log_tags_log_id_fkey";
            columns: ["log_id"];
            isOneToOne: false;
            referencedRelation: "logs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_log_tags_tag_id_fkey";
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
          id: string;
          ip_address: string | null;
          model_name: string | null;
          model_provider_api_key: string | null;
          onellm_api_key: string | null;
          owner_id: string;
          project_id: string;
          prompt_tokens: number | null;
          provider: string | null;
          status: string | null;
          tagged_user_id: string | null;
          type: string | null;
        };
        Insert: {
          api?: string | null;
          chat?: Json | null;
          completion_token?: number | null;
          created_at?: string | null;
          id: string;
          ip_address?: string | null;
          model_name?: string | null;
          model_provider_api_key?: string | null;
          onellm_api_key?: string | null;
          owner_id: string;
          project_id: string;
          prompt_tokens?: number | null;
          provider?: string | null;
          status?: string | null;
          tagged_user_id?: string | null;
          type?: string | null;
        };
        Update: {
          api?: string | null;
          chat?: Json | null;
          completion_token?: number | null;
          created_at?: string | null;
          id?: string;
          ip_address?: string | null;
          model_name?: string | null;
          model_provider_api_key?: string | null;
          onellm_api_key?: string | null;
          owner_id?: string;
          project_id?: string;
          prompt_tokens?: number | null;
          provider?: string | null;
          status?: string | null;
          tagged_user_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_logs_onellm_api_key_fkey";
            columns: ["onellm_api_key"];
            isOneToOne: false;
            referencedRelation: "keys";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "public_logs_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_logs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      model_provider_api_keys: {
        Row: {
          api_key: string | null;
          created_at: string;
          data: string | null;
          id: string;
          model_provider: string | null;
          model_provider_api_key_id: string | null;
          owner_id: string | null;
          project_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          api_key?: string | null;
          created_at?: string;
          data?: string | null;
          id?: string;
          model_provider?: string | null;
          model_provider_api_key_id?: string | null;
          owner_id?: string | null;
          project_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          api_key?: string | null;
          created_at?: string;
          data?: string | null;
          id?: string;
          model_provider?: string | null;
          model_provider_api_key_id?: string | null;
          owner_id?: string | null;
          project_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_model_provider_api_keys_model_provider_api_key_id_fkey";
            columns: ["model_provider_api_key_id"];
            isOneToOne: false;
            referencedRelation: "model_provider_api_keys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_model_provider_api_keys_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_model_provider_api_keys_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      model_repos: {
        Row: {
          data: Json | null;
          description: string | null;
          id: string;
          name: string;
          owner_id: string | null;
          project_id: string;
          type: string | null;
        };
        Insert: {
          data?: Json | null;
          description?: string | null;
          id: string;
          name: string;
          owner_id?: string | null;
          project_id: string;
          type?: string | null;
        };
        Update: {
          data?: Json | null;
          description?: string | null;
          id?: string;
          name?: string;
          owner_id?: string | null;
          project_id?: string;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_model_repos_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_models_repo_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      models: {
        Row: {
          created_at: string | null;
          data: Json | null;
          description: string | null;
          id: string;
          model_provider_api_key_id: string | null;
          models_repo_id: string | null;
          name: string;
          owner_id: string | null;
          project_id: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          description?: string | null;
          id: string;
          model_provider_api_key_id?: string | null;
          models_repo_id?: string | null;
          name: string;
          owner_id?: string | null;
          project_id: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          description?: string | null;
          id?: string;
          model_provider_api_key_id?: string | null;
          models_repo_id?: string | null;
          name?: string;
          owner_id?: string | null;
          project_id?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "models_model_provider_api_key_id_fkey";
            columns: ["model_provider_api_key_id"];
            isOneToOne: false;
            referencedRelation: "model_provider_api_keys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "models_models_repo_id_fkey";
            columns: ["models_repo_id"];
            isOneToOne: false;
            referencedRelation: "model_repos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "models_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_models_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number | null;
          canceled_at: string | null;
          created: string | null;
          created_at: string;
          currency: string | null;
          id: string;
          metadata: Json | null;
          owner_id: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount?: number | null;
          canceled_at?: string | null;
          created?: string | null;
          created_at?: string;
          currency?: string | null;
          id: string;
          metadata?: Json | null;
          owner_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number | null;
          canceled_at?: string | null;
          created?: string | null;
          created_at?: string;
          currency?: string | null;
          id?: string;
          metadata?: Json | null;
          owner_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_payments_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          data: Json | null;
          description: string | null;
          id: string;
          name: string | null;
          owner_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          data?: Json | null;
          description?: string | null;
          id: string;
          name?: string | null;
          owner_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          data?: Json | null;
          description?: string | null;
          id?: string;
          name?: string | null;
          owner_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_projects_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          customer_id: string | null;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          owner_id: string;
          price_id: string | null;
          product_id: string | null;
          quantity: number | null;
          status: string;
          trial_end: string | null;
          trial_start: string | null;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          customer_id?: string | null;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          owner_id: string;
          price_id?: string | null;
          product_id?: string | null;
          quantity?: number | null;
          status: string;
          trial_end?: string | null;
          trial_start?: string | null;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          customer_id?: string | null;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          owner_id?: string;
          price_id?: string | null;
          product_id?: string | null;
          quantity?: number | null;
          status?: string;
          trial_end?: string | null;
          trial_start?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_subscriptions_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          owner_id: string;
          project_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          owner_id: string;
          project_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          owner_id?: string;
          project_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_tags_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      trainings: {
        Row: {
          base_model_id: string | null;
          created_at: string | null;
          data: Json | null;
          dataset_id: string | null;
          description: string | null;
          file_id: string | null;
          id: string;
          model_provider_api_key_id: string | null;
          owner_id: string;
          project_id: string;
          result_model_id: string | null;
          status: string | null;
          title: string;
          training_completed_at: string | null;
          training_provider_id: string | null;
          training_provider_name: string | null;
          training_started_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          base_model_id?: string | null;
          created_at?: string | null;
          data?: Json | null;
          dataset_id?: string | null;
          description?: string | null;
          file_id?: string | null;
          id: string;
          model_provider_api_key_id?: string | null;
          owner_id: string;
          project_id: string;
          result_model_id?: string | null;
          status?: string | null;
          title: string;
          training_completed_at?: string | null;
          training_provider_id?: string | null;
          training_provider_name?: string | null;
          training_started_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          base_model_id?: string | null;
          created_at?: string | null;
          data?: Json | null;
          dataset_id?: string | null;
          description?: string | null;
          file_id?: string | null;
          id?: string;
          model_provider_api_key_id?: string | null;
          owner_id?: string;
          project_id?: string;
          result_model_id?: string | null;
          status?: string | null;
          title?: string;
          training_completed_at?: string | null;
          training_provider_id?: string | null;
          training_provider_name?: string | null;
          training_started_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_trainings_base_model_id_fkey";
            columns: ["base_model_id"];
            isOneToOne: false;
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_trainings_file_id_fkey";
            columns: ["file_id"];
            isOneToOne: false;
            referencedRelation: "files";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_trainings_model_provider_api_key_id_fkey";
            columns: ["model_provider_api_key_id"];
            isOneToOne: false;
            referencedRelation: "model_provider_api_keys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_trainings_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_trainings_result_model_id_fkey";
            columns: ["result_model_id"];
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
        ];
      };
      users: {
        Row: {
          billing_address: Json | null;
          created_at: string;
          email: string;
          first_name: string | null;
          id: string;
          image_url: string | null;
          last_name: string | null;
          payment_method: Json | null;
          stripe_customer_id: string | null;
          updated_at: string;
        };
        Insert: {
          billing_address?: Json | null;
          created_at?: string;
          email: string;
          first_name?: string | null;
          id: string;
          image_url?: string | null;
          last_name?: string | null;
          payment_method?: Json | null;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
        Update: {
          billing_address?: Json | null;
          created_at?: string;
          email?: string;
          first_name?: string | null;
          id?: string;
          image_url?: string | null;
          last_name?: string | null;
          payment_method?: Json | null;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      users_projects_junction: {
        Row: {
          project_id: string;
          role: string | null;
          user_id: string;
        };
        Insert: {
          project_id: string;
          role?: string | null;
          user_id: string;
        };
        Update: {
          project_id?: string;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_users_projects_junction_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_users_projects_junction_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_evaluation_with_models: {
        Args: {
          input_evaluation_id: string;
        };
        Returns: {
          evaluation_id: string;
          evaluation_title: string;
          evaluation_description: string;
          evaluation_owner_id: string;
          evaluation_created_at: string;
          evaluation_updated_at: string;
          evaluation_project_id: string;
          model_id: string;
          model_data: Json;
          model_created_at: string;
          model_description: string;
          model_provider_api_key_id: string;
          model_name: string;
          model_owner_id: string;
          model_updated_at: string;
          models_repo_id: string;
          model_project_id: string;
          model_type: string;
        }[];
      };
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

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
