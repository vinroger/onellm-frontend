"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataPoint } from "@/types/table";
import { useProjectContext } from "@/utils/contexts/useProject";
import { ellipsisString } from "@/utils/functions/string";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { File, LoaderIcon, Pencil, Save, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const postNewDatapoint = async (
  ownerId: string,
  datasetId: string,
  projectId: string
) => {
  const newDatapoint: DataPoint = {
    id: uuidv4(),
    title: "New datapoint",
    data: [],
    dataset_id: datasetId,
    owner_id: ownerId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // POST to api/v1/datapoints using axios
  const response = await axios.post("/api/v1/datapoints", newDatapoint);
  return response.data;
};

function DatapointButton({
  datapoint,
  setActiveDatapointId,
  isActive,
  refetch,
}: {
  datapoint: DataPoint;
  isActive: boolean;
  setActiveDatapointId: (id: string) => void;
  refetch: () => void;
}) {
  const [isHovered, setHovered] = React.useState(false);
  const [isEditing, setEditing] = React.useState(false);

  const [datapointTitle, setDatapointTitle] = React.useState(datapoint.title);

  const handleEdit = async () => {
    setEditing(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/api/v1/datapoints/${datapoint.id}`);
    refetch();
  };

  const handleSave = async () => {
    await axios.put(`/api/v1/datapoints/${datapoint.id}`, {
      title: datapointTitle,
    });
    await refetch();
    setEditing(false);
  };
  return (
    <Button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onClick={() => setActiveDatapointId(datapoint.id)}
      variant="ghost"
      className={cn(
        "flex justify-between h-[30px] min-w-full px-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring",
        isActive && "bg-neutral-50"
      )}
    >
      <div className="flex flex-row items-center max-w-3/4">
        <File
          className={cn("font-light w-4 mr-2", isActive && "font-extrabold")}
          strokeWidth={isActive ? 2 : 1}
        />
        <div className={cn("font-light", isActive && "font-bold")}>
          {!isEditing ? (
            ellipsisString(datapoint.title, 25)
          ) : (
            <div>
              <input
                type="text"
                value={datapointTitle}
                onChange={(event) => setDatapointTitle(event.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      {isHovered && (
        <div className="flex flex-row items-center space-x-2">
          {!isEditing ? (
            <>
              <Button
                variant="ghost"
                className="h-2 p-0 text-green-700"
                onClick={() => {
                  handleEdit();
                }}
              >
                <Pencil className="w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-2 p-0 text-red-700"
                onClick={() => {
                  handleDelete();
                }}
              >
                <Trash className="w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="h-2 p-0 text-blue-700"
              onClick={() => {
                handleSave();
              }}
            >
              <Save className="w-4" />
            </Button>
          )}
        </div>
      )}
    </Button>
  );
}

function Files({
  datapoints,
  setActiveDatapointId,
  activeDatapointId,
  refetch,
  loading,
  setLoading,
}: {
  datapoints: DataPoint[];
  setActiveDatapointId: (id: string) => void;
  activeDatapointId: string;
  refetch: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const { userId } = useAuth();

  const pathname = usePathname();
  const datasetId = pathname?.split("/dataset/")[1];

  const { projectId } = useProjectContext();

  const handleNewFile = async () => {
    if (!userId || !datasetId) throw new Error("No user id or datasetid");
    setLoading(true);
    await postNewDatapoint(userId, datasetId, projectId);
    refetch();
  };
  return (
    <div className="flex flex-col min-w-full p-4">
      <div className="flex flex-row items-center mb-4 ">
        <h1 className="p-0 m-0 font-bold text-md">Datapoints</h1>
        {loading && (
          <LoaderIcon className="w-4 h-4 ml-2 animate-spin text-neutral-500" />
        )}
      </div>
      <Button
        variant="secondary"
        className="mb-3 h-[30px]"
        onClick={() => {
          handleNewFile();
        }}
      >
        + New datapoint
      </Button>
      {datapoints &&
        datapoints.map((datapoint, index) => {
          return (
            <div
              key={datapoint.id}
              className={"flex flex-row items-center min-w-full"}
            >
              <DatapointButton
                isActive={activeDatapointId === datapoint.id}
                datapoint={datapoint}
                setActiveDatapointId={setActiveDatapointId}
                refetch={refetch}
              />
            </div>
          );
        })}
    </div>
  );
}

export default Files;
