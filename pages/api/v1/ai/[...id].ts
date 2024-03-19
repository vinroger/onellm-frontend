/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
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

async function processTags(
  tagsString: string,
  owner_id: string,
  log_id: string,
  project_id: string
) {
  try {
    /* 
  1. Evaluate wherther tagsString is a string or array of string
  2. Extract all tags from the string
  3. Check in database (supabase.tags) where owner_id = user_id and tag.name = tag
  4. If tag does not exist, create it -> get the array of tag_id
  5. update log_tags junction table with tag_id and log_id
  */
    // Check if tagsString is actually an array or a single string, convert to array if the latter
    let tags;
    try {
      // Attempt to parse tagsString in case it's JSON-encoded
      tags = JSON.parse(tagsString);
      // Ensure tags is an array even if tagsString is a single tag
      if (!Array.isArray(tags)) {
        tags = [tags];
      }
    } catch (error) {
      // If JSON.parse fails, assume tagsString is a single, non-JSON-encoded tag
      tags = [tagsString];
    }

    const tagIds = [];

    for (const tagName of tags) {
      // Check if the tag already exists in the database
      let { data: tag, error } = await supabase
        .from("tags")
        .select("id")
        .eq("name", tagName)
        .eq("owner_id", owner_id)
        .single();

      // If the tag doesn't exist, create it
      if (!tag || error) {
        const { data: newTag, error: createError } = await supabase
          .from("tags")
          .insert([{ name: tagName, owner_id, project_id }])
          .select();

        if (createError || !newTag) {
          console.error("Error creating tag:", createError);
          continue; // Skip to the next tag if there's an error
        }

        // eslint-disable-next-line prefer-destructuring
        tag = newTag[0];
      }

      // Assuming tag creation or retrieval was successful, add tag id to the list
      tagIds.push(tag.id);
    }

    // Now, with all the tag IDs, we can update the log_tags junction table
    // This assumes you might want to link multiple tags to a single log entry
    for (const tagId of tagIds) {
      const { error } = await supabase
        .from("log_tags")
        .insert([{ log_id, tag_id: tagId }]);

      if (error) {
        console.error("Error linking tag to log:", error);
      }
    }
  } catch (error) {
    console.error("Error processing tags:", error);
  }
}

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

  const { ownerId, projectId } = payload;

  if (!ownerId || !projectId) {
    return res
      .status(401)
      .json({ error: "Invalid Token. Please re-generate." });
  }

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

    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ error: "Please provide authorization key. (openai apikey)" });
    }

    headers.Authorization = req.headers.authorization;

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
        tagged_user_id: OneLLMUserId as string,
        prompt_tokens: openAIData.usage?.prompt_tokens ?? 0,
        completion_token: openAIData.usage?.completion_tokens ?? 0,
        status: openAIResponse.status === 200 ? "success" : "error",
        project_id: projectId,
        model_provider_api_key: req.headers.authorization ?? "N/A",
      };

      const { data: supabaseResponse, error } = await supabase
        .from("logs")
        .insert([logData])
        .select();

      if (error) {
        console.error("Error creating log:", error);
        throw new Error("Error creating record. Please try again later.");
      }

      const { id: newlogId } = supabaseResponse[0];
      processTags(OneLLMTags as string, ownerId, newlogId, projectId);
    }

    return res.status(openAIResponse.status).json(openAIData);
  } catch (error) {
    console.error("Error proxying request:", error);

    return res
      .status(500)
      .json({ error: `Error processing your request: ${error}` });
  }
}
