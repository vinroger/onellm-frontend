/* eslint-disable no-restricted-syntax */
import { ChatData } from "@/app/(user)/[projectId]/(focus)/dataset/[id]/(components)/details";
import { getOpenAIKey } from "@/utils/api/apikey";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.method === "POST") {
    /* Steps are as follow
        1. The request body should contain projectId
        4. [Supabase] We get the api key from supabase
        7. [OpenAI] We post to open ai for the completion.
        8. [Supabase] Store the fine-tuning data in supabase.
        8. We then return the response from openai
        */

    const { projectId, messages, model } = req.body as {
      projectId: string;
      messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
      model: string;
    };

    // const { apiKey } = await getOpenAIKey(projectId, userId);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Content-Encoding", "none");

    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    try {
      for await (const chunk of stream) {
        const message = chunk.choices[0].delta.content || "";
        res.write(message);
      }
    } catch (error) {
      console.error(error);
      res.write("event: error\ndata: An error occurred\n\n");
    }

    /* Mark if the response is complete. Hacky stuff here */
    res.write("2wJn!HPnjhQnAS#hWDU3DWf3yZk%oB@x@");
  }
  return res.end();
}
