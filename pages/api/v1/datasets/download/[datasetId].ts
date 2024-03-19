import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

import supabase from "../../../supabase-server.component";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "GET") {
      const { datasetId } = req.query as { datasetId: string };

      if (!datasetId) {
        return res.status(400).json({ error: "datasetId is required" });
      }

      const { data: datapoints, error } = await supabase
        .from("data_points")
        .select("*")
        .eq("dataset_id", datasetId)
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!req.query.fileFormat) {
        return res.status(400).json({ error: "fileFormat is required" });
      }

      if (req.query.fileFormat === "jsonl") {
        // Convert datapoints into .jsonl format
        const jsonlContent = datapoints
          .map((datapoint) => JSON.stringify({ messages: datapoint.data }))
          .join("\n");

        // Set headers for file download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=data.jsonl");

        // Send the JSON string as a response
        return res.status(200).send(jsonlContent);
      }
      if (req.query.fileFormat === "json") {
        const cleanedDatapoints = datapoints.map((datapoint) => datapoint.data);
        const jsonContent = JSON.stringify(cleanedDatapoints);

        // Set headers for file download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=data.json");

        // Send the JSON string as a response
        return res.status(200).send(jsonContent);
      }

      if (req.query.fileFormat === "csv") {
        const cleanedDatapoints: { role: string; content: string }[][] =
          datapoints.map((datapoint: any) => datapoint.data);

        const longestConversationLength: number = cleanedDatapoints.reduce(
          (max: number, conversation: { role: string; content: string }[]) =>
            Math.max(max, conversation.length),
          0
        );

        let header: string = "";
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < longestConversationLength; i++) {
          header += "role,content,";
        }
        header = header.slice(0, -1);
        const csvRows: string[] = [header];

        cleanedDatapoints.forEach((conversation) => {
          let row: string = "";
          conversation.forEach((message) => {
            row += `${message.role},${message.content.replace(/,/g, ";")},`;
          });
          const emptyCellsCount: number =
            (longestConversationLength - conversation.length) * 2;
          row += ",".repeat(emptyCellsCount).slice(0, -1);
          csvRows.push(row.slice(0, -1));
        });

        const csvContent: string = csvRows.join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=data.csv");

        return res.status(200).send(csvContent);
      }
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(JSON.stringify(error), (error as any)?.response?.data, error);
    return res.status(500).json({ error: (error as any)?.message });
  }
}
