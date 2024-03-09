import { Tag } from "./tag";

export type LogEntry = {
  id: number;
  created_at: Date;
  api: string;
  chat: any;
  prompt_tokens: number;
  completion_token: number;
  ip_address: string;
  type: string;
  provider: string;
  tags: Tag[];
};
