export type Evaluation = {
  id: string;
  created_at: Date;
  updated_at: Date;
  dataset_id: number;
  model_ids: string[];
  score: number;
  comment: string;
  tags: string[];
};
