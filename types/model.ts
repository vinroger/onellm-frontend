export type Model = {
  id: string;
  name: string;
  description: string;
  provider: string;
  created_at: Date;
  updated_at: Date;
  version_id: string;
  integration_id: string; // for integration with open ai, gemini, etc
  api_key: string;
  initial_prompt: any; // JSON binary
};
