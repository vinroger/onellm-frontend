import { useAuth } from "@clerk/nextjs";
import { useSupabase } from "@/utils/supabase";

export default function Home() {
  const { getToken } = useAuth();
  const supabase = useSupabase();

  const fetchData = async () => {
    // TODO #1: Replace with your JWT template name
    const token = await getToken({ template: "supabase" });

    // TODO #2: Replace with your database table name
    const { data, error } = await supabase.from("logs").select();

    // TODO #3: Handle the response
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      console.log("Data:", data);
    }
  };

  return (
    <button type="button" onClick={fetchData}>
      Fetch data
    </button>
  );
}
