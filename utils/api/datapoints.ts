import supabase from "@/pages/api/supabase-server.component";
import { DataPoint } from "@/types/table";
import axios from "axios";

export async function GETDatapointsByDatasetId(
  datasetId: string,
  userId: string
): Promise<DataPoint[]> {
  const { data: datapoints, error } = await supabase
    .from("data_points")
    .select("*")
    .eq("dataset_id", datasetId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return datapoints;
}
