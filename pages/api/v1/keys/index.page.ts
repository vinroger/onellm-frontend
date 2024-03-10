import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { generateJwtToken } from "@/utils/functions/jwt";
import supabase from "../../supabase-server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(
    "%cpages/api/v1/keys/index.page.ts:14 userId",
    "color: #007acc;",
    userId
  );
  if (req.method === "GET") {
    const { data: keys, error } = await supabase
      .from("keys")
      .select("*")
      .eq("owner_id", userId);
    res.status(200).send({ keys });
  }

  const newToken = generateJwtToken({ ownerId: userId! });

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ keys: newToken });
  return null;
  return;
}
