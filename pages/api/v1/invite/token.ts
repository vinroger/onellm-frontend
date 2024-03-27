// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  generateJWTTokenAnyPayload,
  verifyJwtToken,
} from "@/utils/functions/jwt";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    const { token } = req.body as { token: string };

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      verifyJwtToken(token);
    } catch (error) {
      return res.status(400).json({ error: (error as any).message });
    }

    const payload: any = verifyJwtToken(token);

    const { projectId } = payload;

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // save in supabase

    const { data, error } = await supabase
      .from("users_projects_junction")
      .insert([
        {
          user_id: userId,
          project_id: projectId,
          role: "collaborator",
        },
      ])
      .select("*");

    if (error) {
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        return res.status(200).json({ status: "Record already exists." });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }
  return res.status(400).json({ error: "Method not allowed" });
}
