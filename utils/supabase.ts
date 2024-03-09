// useSupabase.ts
import { use, useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This function initializes the Supabase client outside of the hook to ensure it's a singleton
// const initSupabase = () => createClient(supabaseUrl, supabaseKey);

let supabaseSingleton: SupabaseClient | null = null;

export function useSupabase(): SupabaseClient<Database> | null {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const updateToken = async () => {
      const response = await getToken({ template: "supabase" });

      if (response) {
        setToken(response);
      }
    };
    updateToken();
  }, [getToken]);

  useEffect(() => {
    // Assuming the token must be used in each request header
    // This pattern is for example purposes; you may need a different method to apply the token
    supabaseSingleton = createClient<Database>(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    setSupabase(supabaseSingleton);

    return () => {
      supabaseSingleton = null;
    };
  }, [token]); // This effect depends on getToken function, which should remain stable

  return supabase;
}
