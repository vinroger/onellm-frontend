/* eslint-disable jsx-a11y/aria-role */

"use client";

import { DataPoint } from "@/types/table";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useDebounceCallback } from "usehooks-ts";
import { useDatasetContext } from "@/utils/contexts/useDataset";

export type ChatData = {
  role: string;
  content: string;
}[];

function MessageRenderer({
  role,
  content,
  handleChange,
  handleDelete,
}: {
  role: string;
  content: string;
  handleChange: (newMessage: { role: string; content: string }) => void;
  handleDelete: () => void;
}) {
  const [message, setMessage] = useState(content);
  return (
    <div className="flex max-w-full mb-3 space-x-2">
      <div className="flex flex-row max-w-full min-w-full space-x-5">
        <Select
          value={role}
          onValueChange={(val) => {
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

function FormattedDisplay({ datapoint }: { datapoint: DataPoint }) {
  const { updateDatapoint, setDatapoints } = useDatasetContext();

  const data = datapoint.data as ChatData;

  const handleNewMessage = async () => {
    const newMessage = {
      role: "user",
      content: "hello",
    };

    await updateDatapoint(datapoint.id, {
      data: [...data, newMessage],
    });
  };

  const handleChangeMessageAtIdx = async (
    idx: number,
    newMessage: {
      role: string;
      content: string;
    }
  ) => {
    const newData = [...data];
    newData[idx] = newMessage;

    await updateDatapoint(
      datapoint.id,
      {
        data: newData,
      },
      1000
    );
  };

  if (!datapoint || !datapoint.data) {
    return <div>No data</div>;
  }

  const handleDeleteAtIdx = async (idx: number) => {
    const newData = [...data];
    newData.splice(idx, 1);

    await updateDatapoint(datapoint.id, {
      data: newData,
    });
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

function Details() {
  const pathname = usePathname();

  if (!pathname) {
    throw new Error("No pathname");
  }

  const [activeTab, setActiveTab] = React.useState<"formatted" | "json">(
    "formatted"
  );

  const { activeDatapoint } = useDatasetContext();

  if (!activeDatapoint) {
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
        <FormattedDisplay datapoint={activeDatapoint} />
      ) : (
        <JSONDisplay datapoint={activeDatapoint} />
      )}
    </div>
  );
}

export default Details;
