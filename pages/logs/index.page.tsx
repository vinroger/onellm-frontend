/* eslint-disable react/jsx-curly-newline */
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Layout from "@/components/TopLayout";
import { Button } from "@/components/ui/button";
import {
  DataTablePagination,
  usePaginatedDataTable,
} from "@/components/ui/data-table";

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
  email: `test`,
}));

export default function Home() {
  const { PaginatedDataTable, table } = usePaginatedDataTable({
    data: data2,
    columns,
  });
  return (
    <Layout>
      <div className="flex flex-col w-full">
        logss
        <div className="w-full">
          <PaginatedDataTable />
        </div>
        <div className="w-full">
          <DataTablePagination table={table} />
        </div>
      </div>
    </Layout>
  );
}
