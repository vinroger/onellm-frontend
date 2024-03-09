/* eslint-disable react/jsx-curly-newline */
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Layout from "@/components/TopLayout";
import { Button } from "@/components/ui/button";
import {
  DataTablePagination,
  usePaginatedDataTable,
} from "@/components/ui/data-table";
import { Card } from "@/components/ui/card";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

const data: Payment[] = [
  {
    id: "1",
    amount: 100,
    status: "pending",
    email: "test",
  },
];

const data2: Payment[] = Array.from({ length: 100 }, (_, i) => ({
  id: i.toString(),
  amount: 30,
  status: "pending",
  email: "test",
}));

export default function Home() {
  const { PaginatedDataTable, table } = usePaginatedDataTable({
    data: data2,
    columns,
  });
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
          <PaginatedDataTable />
          <DataTablePagination table={table} />
        </Card>
        {/* </div> */}
      </div>
    </Layout>
  );
}
