// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateJWTTokenAnyPayload } from "@/utils/functions/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Process a POST request
    const { projectId } = req.body as { projectId: string };

    const token = generateJWTTokenAnyPayload(
      {
        projectId,
      },
      "15m"
    );

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/project/invite/${token}`;

    return res.status(200).json(url);
  }
  return res.status(400).json({ error: "Method not allowed" });
}
