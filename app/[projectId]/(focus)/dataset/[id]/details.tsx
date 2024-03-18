/* eslint-disable jsx-a11y/aria-role */

"use client";

import { DataPoint } from "@/types/table";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Braces, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useDebounceCallback } from "usehooks-ts";

export type ChatData = {
  role: string;
  content: string;
}[];

function MessageRenderer({
  role: roleInp,
  content,
  handleChange,
  handleDelete,
}: {
  role: string;
  content: string;
  handleChange: (newMessage: { role: string; content: string }) => void;
  handleDelete: () => void;
}) {
  const [role, setRole] = React.useState(roleInp);
  useEffect(() => {
    setRole(roleInp);
  }, [roleInp]);
  const [message, setMessage] = React.useState(content);

  return (
    <div className="flex max-w-full mb-3 space-x-2">
      <div className="flex flex-row max-w-full min-w-full space-x-5">
        <Select
          value={role}
          onValueChange={(val) => {
            setRole(val);
            handleChange({ role: val, content });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a role</SelectLabel>
              <SelectItem value="system">system</SelectItem>
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="assistant">assistant</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <textarea
          className="flex flex-1 p-2.5 text-sm rounded-lg bg-neutral-100 "
          value={message}
          onChange={async (event) => {
            setMessage(event.target.value);
            handleChange({ role, content: event.target.value });
          }}
        />
        <div className="self-center">
          <Button
            variant="ghost"
            className="h-2 p-0 text-red-700"
            onClick={() => {
              handleDelete();
            }}
          >
            <Trash className="w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FormattedDisplay({
  datapoint,
  refetch,
}: {
  datapoint: DataPoint;
  refetch: () => void;
}) {
  const [data, setData] = useState<ChatData>(datapoint.data as ChatData);
  useEffect(() => {
    setData([...(datapoint.data as any)]);
  }, [datapoint.data, setData]);

  const handleNewMessage = async () => {
    const newMessage = {
      role: "user",
      content: "hello",
    };
    setData([...data, newMessage]);

    await axios.put(`/api/v1/datapoints/${datapoint.id}`, {
      data: [...data, newMessage],
    });
    refetch();
  };

  const handleChangeMessageAtIdx = useDebounceCallback(
    async (
      idx: number,
      newMessage: {
        role: string;
        content: string;
      }
    ) => {
      const newData = [...data];
      newData[idx] = newMessage;

      await axios.put(`/api/v1/datapoints/${datapoint.id}`, {
        data: newData,
      });
      refetch();
    },
    500
  );

  if (!datapoint || !datapoint.data) {
    return <div>No data</div>;
  }

  const handleDeleteAtIdx = async (idx: number) => {
    const newData = [...data];
    newData.splice(idx, 1);
    setData(newData);

    await axios.put(`/api/v1/datapoints/${datapoint.id}`, {
      data: newData,
    });

    refetch();
  };

  return (
    <div className="flex flex-col max-w-full">
      {data.length > 0 ? (
        data.map((message, index) => {
          return (
            <MessageRenderer
              key={`${String(index)}msg`}
              role={message.role}
              content={message.content}
              handleChange={(newMessage: { role: string; content: string }) => {
                handleChangeMessageAtIdx(index, newMessage);
              }}
              handleDelete={() => {
                handleDeleteAtIdx(index);
              }}
            />
          );
        })
      ) : (
        <div>
          No messages found. Create new message by clicking this button.
        </div>
      )}
      {/* <MessageRenderer role={"system"} content={"hello"} /> */}
      <Button
        variant="default"
        className="mb-3 h-[30px] w-[200px] mt-5"
        onClick={() => {
          handleNewMessage();
        }}
      >
        + New Message
      </Button>
    </div>
  );
}

function JSONDisplay({ datapoint }: { datapoint: DataPoint }) {
  return (
    <pre className="p-4 overflow-scroll text-sm text-left whitespace-pre-wrap bg-gray-100 rounded-lg text-muted-foreground">
      <code>{JSON.stringify(datapoint.data, null, 2)}</code>
    </pre>
  );
}

function Details({
  datapoint,
  refetch,
}: {
  datapoint?: DataPoint;
  refetch: () => void;
}) {
  const pathname = usePathname();

  if (!pathname) {
    throw new Error("No pathname");
  }

  const id = pathname.split("/dataset/")[1];

  const [activeTab, setActiveTab] = React.useState<"formatted" | "json">(
    "formatted"
  );

  if (!datapoint) {
    return (
      <div className="flex items-center justify-center min-w-full min-h-full p-7">
        Please select a datapoint from the left to continue.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-full min-h-full p-4">
      <div className="flex flex-row justify-start min-w-full">
        <Tabs defaultValue="formatted" className="max-w-[300px] mb-10">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="formatted"
              onClick={() => setActiveTab("formatted")}
            >
              Formatted
            </TabsTrigger>
            <TabsTrigger value="json" onClick={() => setActiveTab("json")}>
              <Braces className="h-4" />
              Raw JSON
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {activeTab === "formatted" ? (
        <FormattedDisplay datapoint={datapoint} refetch={refetch} />
      ) : (
        <JSONDisplay datapoint={datapoint} />
      )}
    </div>
  );
}

export default Details;
