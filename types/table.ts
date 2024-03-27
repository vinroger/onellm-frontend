import { Database } from "@/types/supabase";

// type Json = any; // Assuming Json is defined globally or as needed

export type DataPoint = Database["public"]["Tables"]["data_points"]["Row"];
export type DataPointInsert =
  Database["public"]["Tables"]["data_points"]["Insert"];
export type DataPointUpdate =
  Database["public"]["Tables"]["data_points"]["Update"];

export type DataSet = Database["public"]["Tables"]["datasets"]["Row"];
export type DataSetInsert = Database["public"]["Tables"]["datasets"]["Insert"];
export type DataSetUpdate = Database["public"]["Tables"]["datasets"]["Update"];

export type EvaluationModel =
  Database["public"]["Tables"]["evaluation_models"]["Row"];
export type EvaluationModelInsert =
  Database["public"]["Tables"]["evaluation_models"]["Insert"];
export type EvaluationModelUpdate =
  Database["public"]["Tables"]["evaluation_models"]["Update"];

export type EvaluationPoint =
  Database["public"]["Tables"]["evaluation_points"]["Row"];
export type EvaluationPointInsert =
  Database["public"]["Tables"]["evaluation_points"]["Insert"];
export type EvaluationPointUpdate =
  Database["public"]["Tables"]["evaluation_points"]["Update"];

export type EvaluationPointJoinedDataPoint = EvaluationPoint & {
  data_point: DataPoint | null;
};

export type EvaluationTag =
  Database["public"]["Tables"]["evaluation_tags"]["Row"];
export type EvaluationTagInsert =
  Database["public"]["Tables"]["evaluation_tags"]["Insert"];
export type EvaluationTagUpdate =
  Database["public"]["Tables"]["evaluation_tags"]["Update"];

export type Evaluation = Database["public"]["Tables"]["evaluations"]["Row"];
export type EvaluationInsert =
  Database["public"]["Tables"]["evaluations"]["Insert"];
export type EvaluationUpdate =
  Database["public"]["Tables"]["evaluations"]["Update"];

export type LogTag = Database["public"]["Tables"]["log_tags"]["Row"];
export type LogTagInsert = Database["public"]["Tables"]["log_tags"]["Insert"];
export type LogTagUpdate = Database["public"]["Tables"]["log_tags"]["Update"];

export type Log = Database["public"]["Tables"]["logs"]["Row"];
export type LogInsert = Database["public"]["Tables"]["logs"]["Insert"];
export type LogUpdate = Database["public"]["Tables"]["logs"]["Update"];

export type Model = Database["public"]["Tables"]["models"]["Row"];
export type ModelInsert = Database["public"]["Tables"]["models"]["Insert"];
export type ModelUpdate = Database["public"]["Tables"]["models"]["Update"];

export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
export type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];

export type Training = Database["public"]["Tables"]["trainings"]["Row"];
export type TrainingInsert =
  Database["public"]["Tables"]["trainings"]["Insert"];
export type TrainingUpdate =
  Database["public"]["Tables"]["trainings"]["Update"];

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type Key = Database["public"]["Tables"]["keys"]["Row"];
export type KeyInsert = Database["public"]["Tables"]["keys"]["Insert"];
export type KeyUpdate = Database["public"]["Tables"]["keys"]["Update"];

export type ModelProviderApiKey =
  Database["public"]["Tables"]["model_provider_api_keys"]["Row"];
export type ModelProviderApiKeyInsert =
  Database["public"]["Tables"]["model_provider_api_keys"]["Insert"];
export type ModelProviderApiKeyUpdate =
  Database["public"]["Tables"]["model_provider_api_keys"]["Update"];

export type ModelRepo = Database["public"]["Tables"]["model_repos"]["Row"];
export type ModelRepoInsert =
  Database["public"]["Tables"]["model_repos"]["Insert"];
export type ModelRepoUpdate =
  Database["public"]["Tables"]["model_repos"]["Update"];

export type Chat = {
  role: string;
  content: string;
}[];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type OneLLMFile = Database["public"]["Tables"]["files"]["Row"];
export type OneLLMFileInsert = Database["public"]["Tables"]["files"]["Insert"];
export type OneLLMFileUpdate = Database["public"]["Tables"]["files"]["Update"];

export type OneLLMSubscription =
  Database["public"]["Tables"]["subscriptions"]["Row"];
export type OneLLMSubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
export type OneLLMSubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];

export type OneLLMPayment = Database["public"]["Tables"]["payments"]["Row"];
export type OneLLMPaymentInsert =
  Database["public"]["Tables"]["payments"]["Insert"];
export type OneLLMPaymentUpdate =
  Database["public"]["Tables"]["payments"]["Update"];
