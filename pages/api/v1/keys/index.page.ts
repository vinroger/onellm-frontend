import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { generateJwtToken } from "@/utils/functions/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  const newToken = generateJwtToken({ ownerId: userId! });

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ keys: newToken });
  return null;
}
