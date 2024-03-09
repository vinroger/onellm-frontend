import { Database } from "@/types/supabase";

type Json = any; // Assuming Json is defined globally or as needed

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

export type Chat = {
  role: string;
  content: string;
}[];
