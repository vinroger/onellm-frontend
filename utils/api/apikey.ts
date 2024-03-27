import supabase from "@/pages/api/supabase-server.component";

export async function getOpenAIKey(projectId: string, userId: string) {
  const { data: apiKeys, error: apiKeyError } = await supabase
    .from("model_provider_api_keys")
    .select("*")
    .eq("project_id", projectId);

  const apiKey = apiKeys?.[0]?.api_key;
  const apiKeyId = apiKeys?.[0]?.id;

  if (apiKeyError || apiKeys.length === 0 || !apiKey || !apiKeyId) {
    console.error("Error getting logs:", apiKeyError);
    throw new Error("No API keys found for the user");
  }

  return {
    apiKey,
    apiKeyId,
  };
}
