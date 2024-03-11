/* eslint-disable no-underscore-dangle */
import type { NextApiRequest, NextApiResponse } from "next";

import { verifyJwtToken } from "@/utils/functions/jwt";
import { Log } from "@/types/table";
import requestIp from "request-ip";
import { v4 as uuidv4 } from "uuid";
import supabase from "../../supabase-server.component";

// Function to construct the OpenAI URL by replacing the domain
const constructOpenAIUrl = (req: NextApiRequest): string => {
  const baseUrl = "https://api.openai.com/v1/";
  const path = req.url?.replace("/api/v1/ai/", ""); // Adjust based on your API routing
  return `${baseUrl}${path}`;
};

type LogCpy = {
  api: string | null;
  api_key_id: string | null;
  chat: any;
  completion_token: number | null;
  created_at: string | null;
  id: number;
  ip_address: string | null;
  owner_id: string;
  prompt_tokens: number | null;
  provider: string | null;
  type: string | null;
  user_id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* STEP ONE:  VERIFY ONELLM TOKEN */

  const {
    "x-onellm-api-key": OneLLMApiKey,
    "x-onellm-user-id": OneLLMUserId,
    "x-onellm-tags": OneLLMTags,
  } = req.headers;

  // Decode token
  const payload: any = verifyJwtToken(OneLLMApiKey as string);

  const { ownerId } = payload;

  const ipAddress =
    requestIp.getClientIp(req) && requestIp.getClientIp(req) !== "::1"
      ? requestIp.getClientIp(req)
      : "Unknown";

  // Proxy the request to OpenAI
  try {
    const openAIUrl = constructOpenAIUrl(req);
    const requestBody = JSON.stringify(req.body);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    const openAIResponse = await fetch(openAIUrl, {
      method: req.method,
      headers,
      body: requestBody,
    });

    const openAIData = await openAIResponse.json();

    // Log the incoming request and openai response details
    if (openAIUrl === "https://api.openai.com/v1/chat/completions") {
      const chatData = openAIData.choices
        ? [...req.body.messages, openAIData.choices[0].message]
        : null;
      const logData: Log = {
        id: openAIData.id ?? uuidv4(),
        owner_id: ownerId,
        onellm_api_key: OneLLMApiKey as string,
        api: openAIUrl,
        type: "chat.completion",
        created_at: new Date().toISOString(),
        ip_address: ipAddress,
        provider: "openai",
        chat: chatData,
        user_id: OneLLMUserId as string,
        prompt_tokens: openAIData.usage?.prompt_tokens ?? 0,
        completion_token: openAIData.usage?.completion_tokens ?? 0,
        status: openAIResponse.status === 200 ? "success" : "error",
      };

      const { data: supabaseResponse, error } = await supabase
        .from("logs")
        .insert([logData])
        .select();
    }

    return res.status(openAIResponse.status).json(openAIData);
  } catch (error) {
    console.error("Error proxying request:", error);

    return res
      .status(500)
      .json({ error: `Error processing your request: ${error}` });
  }
}
