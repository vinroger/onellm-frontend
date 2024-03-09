/* eslint-disable react/jsx-curly-newline */
import {
  ColumnDef,
  Row,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Layout from "@/components/TopLayout";
import { Button } from "@/components/ui/button";
import {
  DataTablePagination,
  usePaginatedDataTable,
} from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";
import { Log } from "@/utils/table";
import { useSupabase } from "@/utils/supabase";
import useAsync from "@/utils/hooks/useAsync";

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "id",
    header: "API",
  },
  {
    accessorKey: "created_at",
    header: "timestamp",
    // Example of using a cell to format the date, if desired
    cell: (info) =>
      info.getValue() ? new Date(info.getValue()).toLocaleString() : "",
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
    accessorKey: "chat",
    header: "Chat",
    cell: (info) => JSON.stringify(info.getValue()) ?? "N/A",
  },
];

export default function Home() {
  const supabase = useSupabase();

  const { execute, value, error } = useAsync(async () => {
    if (!supabase) {
      return [];
    }
    const { data } = await supabase.from("logs").select();
    return data;
  });

  const { PaginatedDataTable, table } = usePaginatedDataTable({
    data: value,
    columns,
  });

  useEffect(() => {
    execute();
  }, [execute, supabase]);

  if (!supabase || !table) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
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
              console.log(
                "%cpages/logs/index.page.tsx:97 row",
                "color: #007acc;",
                row
              );
            }}
          />
          <DataTablePagination table={table} />
        </Card>
        {/* </div> */}
      </div>
    </Layout>
  );
}
