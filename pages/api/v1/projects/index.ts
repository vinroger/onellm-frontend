/* eslint-disable camelcase */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(projects);
  }

  if (req.method === "POST") {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          owner_id: userId,
          description: req.body.description,
          data: req.body.data,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          name: req.body.name,
        },
      ])
      .eq("owner_id", userId)
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...req.body,
      })
      .eq("owner_id", userId)
      .eq("id", req.body.id)
      // .eq("id", req.body.id) TODO
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
