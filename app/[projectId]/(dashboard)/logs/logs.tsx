"use client";

/* eslint-disable react/jsx-curly-newline */
import { ColumnDef, Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import Layout from "@/components/TopLayout";
import {
  DataTablePagination,
  usePaginatedDataTable,
} from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { toHumanDateString } from "@/utils/functions/date";

import { Log } from "@/types/table";

import { DetailDialog } from "./dialog";
import { useProjectContext } from "@/utils/contexts/useProject";

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue();

      if (status !== "error") {
        return <span className="font-bold text-green-600">Successful</span>;
      }
      return <span className="font-bold text-red-600">Error</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Timestamp",
    // Example of using a cell to format the date, if desired
    cell: (info) =>
      info.getValue()
        ? toHumanDateString(new Date(String(info.getValue())))
        : "",
  },
  {
    accessorKey: "api",
    header: "API",
  },
  {
    accessorKey: "prompt",
    header: "Prompt",
    cell: (info) => {
      const maxLength = 50; // Maximum characters length
      const { chat } = info.row.original as any;
      if (!chat) return "N/A";
      const prompt = chat.find((c: any) => c.role === "user");
      if (!prompt) return "N/A";
      const { content } = prompt;
      if (!content) return "N/A";
      return content.length > maxLength
        ? `${content.substring(0, maxLength - 3)}...`
        : content;
    },
  },
  {
    accessorKey: "completion",
    header: "Completion",
    cell: (info) => {
      const maxLength = 50; // Maximum characters length
      const { chat } = info.row.original as any;
      if (!chat) return "N/A";
      const prompt = chat.find((c: any) => c.role === "assistant");
      if (!prompt) return "N/A";
      const { content } = prompt;
      if (!content) return "N/A";
      return content.length > maxLength
        ? `${content.substring(0, maxLength - 3)}...`
        : content;
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
  },
  {
    accessorKey: "prompt_tokens",
    header: "Prompt Tokens",
    // Assuming you want to display a default value or some formatting
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "completion_token",
    header: "Completion Token",
    cell: (info) => info.getValue() ?? "N/A",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "user_id",
    header: "User ID",
  },
];

const fetchLogs = async (projectId: string) => {
  const response = await axios.get("/api/v1/logs", {
    params: {
      projectId,
    },
  });
  return response.data.logs;
};

export default function Logs() {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);

  const { projectId } = useProjectContext();

  const loadLogs = async () => {
    setLoading(true);
    const fetchedKeys = await fetchLogs(projectId);
    setLogs(fetchedKeys);
    setLoading(false);
  };

  const { PaginatedDataTable, table } = usePaginatedDataTable({
    data: logs,
    columns,
  });

  useEffect(() => {
    loadLogs();
  }, []);

  if (!table || loading) {
    return <LoaderIcon className="animate-spin" />;
  }

  return (
    <div className="flex flex-col flex-1 p-5 space-y-2">
      <Card className="space-y-4 p-7">
        <div>
          <h1 className="p-0 m-0 text-lg font-bold">Prompt Logs</h1>
          <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
            See your usage of LLM here!
          </p>
        </div>
        <PaginatedDataTable
          onRowClick={(row: Row<any>) => {
            setSelectedLog(row.original);
            setIsModalOpen(true);
          }}
        />
        <DataTablePagination table={table} />
      </Card>
      <DetailDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}
