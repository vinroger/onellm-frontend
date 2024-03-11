import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { generateJwtToken } from "@/utils/functions/jwt";
import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query as { id: string };

  if (req.method === "DELETE") {
    const { data: keys, error } = await supabase
      .from("keys")
      .delete()
      .eq("id", id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ keys });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
