export type Training = {
  id: string;
  base_model_id: string;
  title: string;
  description: string;
  dataset_id: string;
  result_model_id: string;
  status: string;
  training_started_at: Date;
  training_completed_at: Date;
  data: any; // JSON binary
  integration_id: string; // for integration with open ai, gemini, etc
  created_at: Date;
  updated_at: Date;
};
