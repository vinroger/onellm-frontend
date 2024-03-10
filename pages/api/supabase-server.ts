import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const SUPABASE_URL = "https://venvcaaqbhasginfnqla.supabase.co";

const supabase = createClient<Database>(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY!
);

export default supabase;
