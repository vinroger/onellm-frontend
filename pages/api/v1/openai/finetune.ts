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

  if (req.method === "POST") {
    const { projectId } = req.query as { projectId: string };

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }
    const { data: datasets, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("owner_id", userId)
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Error getting logs:", error);
      return res.status(500).json({ error: error.message });
    }

    // upload file to openai first.
    // const formData = new FormData();

    // const blob = new Blob([jsonlContent], { type: "application/json" });
    // // const buffer = Buffer.from(jsonlContent, "utf-8");
    // formData.append("file", blob, "file.txt");
    // formData.append("purpose", "fine-tune");

    // const openAIResponse = await axios
    //   .post("https://api.openai.com/v1/files", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //   })
    //   .catch((error) => {
    //     console.error(error.response.data);
    //   });
    // console.log("hello");

    // return res.status(200).json();

    return res.status(200).json(datasets);
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
