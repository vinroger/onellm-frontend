/* eslint-disable no-restricted-syntax */
import supabase from "@/pages/api/supabase-server.component";
import { DataPoint } from "@/types/table";
import axios from "axios";

export const validateDatasetHelper = (
  datapoints: DataPoint[]
): {
  message: string;
  status: "ERROR" | "PASSED";
} => {
  if (datapoints.length < 10) {
    return {
      message: "Dataset should contain at least 10 datapoints",
      status: "ERROR",
    };
  }

  for (const datapoint of datapoints) {
    if (!datapoint.data) {
      return {
        message: "All and every datapoints should contain a data field",
        status: "ERROR",
      };
    }
    let assistantMessageCount = 0;
    let userMessageCount = 0;
    const datapointData = datapoint.data as any;
    for (const message of datapointData) {
      if (message.role === "assistant") {
        assistantMessageCount += 1;
      } else {
        userMessageCount += 1;
      }
    }
    if (assistantMessageCount < 1 || userMessageCount < 1) {
      return {
        message:
          "All and every datapoints should contain at least 1 assistant and 1 user message",
        status: "ERROR",
      };
    }
  }

  return {
    message: "Dataset is valid",
    status: "PASSED",
  };
};

export async function validateDataset(datasetId: string) {
  const { data: datapoints } = await axios.get("/api/v1/datapoints", {
    params: {
      datasetId,
    },
  });

  if (!datapoints || datapoints.length === 0) {
    return {
      message: "Dataset should contain at least 10 data points",
      status: "ERROR",
    };
  }

  const validation = validateDatasetHelper(datapoints);

  return validation;
}
