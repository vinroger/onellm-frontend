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

  const { datapointId } = req.query as { datapointId: string };

  if (req.method === "PUT") {
    const { data: datapoints, error } = await supabase
      .from("data_points")
      .update({ ...req.body })
      .eq("id", datapointId)
      .eq("owner_id", userId)
      .select();

    // update dataset updated_date
    await supabase
      .from("datasets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", datapointId)
      .eq("owner_id", userId)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(datapoints);
  }

  if (req.method === "DELETE") {
    const { data: datapoints, error } = await supabase
      .from("data_points")
      .delete()
      .eq("id", datapointId)
      .eq("owner_id", userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ datapoints });
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
