import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import supabase from "../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { data: datapoints, error } = await supabase
      .from("data_points")
      .insert({ ...req.body })
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(datapoints);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
