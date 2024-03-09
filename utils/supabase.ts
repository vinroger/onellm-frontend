// useSupabase.ts
import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This function initializes the Supabase client outside of the hook to ensure it's a singleton
const initSupabase = () => createClient(supabaseUrl, supabaseKey);

let supabaseSingleton: SupabaseClient | null = null;

export function useSupabase(): SupabaseClient {
  const [supabase, setSupabase] = useState<SupabaseClient>(initSupabase);
  const { getToken } = useAuth();
  const [tokenState, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true; // Flag to prevent setting state on unmounted component

    const updateToken = async () => {
      const token = await getToken({ template: "supabase" });

      if (token && isSubscribed) {
        // Assuming the token must be used in each request header
        // This pattern is for example purposes; you may need a different method to apply the token
        supabaseSingleton = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });

        setSupabase(supabaseSingleton);
      }
    };

    updateToken();

    return () => {
      isSubscribed = false; // Clean-up function to avoid setting state after component unmount
    };
  }, [getToken]); // This effect depends on getToken function, which should remain stable

  return supabase;
}
