/* eslint-disable react/jsx-curly-newline */

"use client";

import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Project } from "@/types/table";
import useAsync from "@/utils/hooks/useAsync";
import useDeleteConfirmationDialog from "@/utils/hooks/useDeleteConfirmationDialog";
import { UserButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { FolderGit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toHumanDateString } from "@/utils/functions/date";

function ProjectCard({
  projectName,
  description,
  lastEdited,
  projectId,
  refetch,
}: {
  projectName: string | null;
  description: string | null;
  lastEdited: string | null;
  projectId: string;
  refetch: () => void;
}) {
  const router = useRouter();
  const { DialogConfimationCompoment, setOpen } = useDeleteConfirmationDialog();

  const handleDelete = async () => {
    setOpen(false);
    await axios.delete(`/api/v1/projects/${projectId}`);
    await refetch();
    toast("Project has been deleted", {
      description: `The project ${projectName} has been deleted.`,
    });
  };
  const [isHovered, setHovered] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer relative",
        isHovered && "bg-neutral-100"
      )}
      onClick={() => {
        router.push(`/${projectId}/dashboard`);
      }}
      onMouseEnter={() => {
        setHovered(true);
        setShowDeleteButton(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setShowDeleteButton(false);
      }}
    >
      <div className="space-y-1">
        <h1 className="p-0 m-0 font-semibold text-md">{projectName}</h1>
        <p className="p-0 m-0 text-xs text-neutral-600">{description}</p>
        <p className="p-0 m-0 mb-2 text-xs text-neutral-600">
          Last Edited at {toHumanDateString(new Date(lastEdited ?? ""))}
        </p>
      </div>

      {showDeleteButton && (
        <button
          type="button"
          onClick={(e) => {
            setOpen(true);
            e.stopPropagation();
          }}
          onMouseEnter={(e) => {
            setHovered(false);
            e.stopPropagation();
          }}
          onMouseLeave={(e) => {
            setHovered(showDeleteButton);
            e.stopPropagation();
          }}
          className="absolute top-0 right-0 p-3 mt-2 mr-2 rounded-md hover:bg-neutral-100"
        >
          <Trash2 className="w-4 h-4 text-red-700" />
        </button>
      )}
      <DialogConfimationCompoment
        onConfirm={() => {
          handleDelete();
        }}
      />
    </Card>
  );
}

export const CreateNewProjectDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [ProjectData, setProjectData] = useState<Partial<Project>>({
    description: "",
    name: "",
    owner_id: "",
  });

  const router = useRouter();

  const handleSubmit = async () => {
    const response: any = await axios.post("/api/v1/projects/", ProjectData);

    setProjectData({
      description: "",
      name: "",
      owner_id: "",
    });
    await onClose();

    toast("Project has been created", {
      description: `You can now start adding datapoints to the ${response.data[0].name} Project.`,
      action: {
        label: <div>Go to Project →</div>,
        onClick: () => {
          router.push(`/${response.data[0].id}/dashboard`);
        },
      },
    });
  };

  const isSubmitButtonDistabled =
    ProjectData.name?.length === 0 || ProjectData.description?.length === 0;

  return (
    <div className="min-w-screen">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[850px]">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-col placeholder:min-w-full">
              <div className="flex flex-col items-center justify-center min-w-full mb-2">
                <FolderGit2 className="mb-2 text-green-500 h-[25px] w-[25px]" />
                <h1 className="max-w-[250px] text-center">
                  Ready to streamline your LLM building process? :{")"}
                </h1>
              </div>
              <div className="flex flex-col min-w-full mt-3 text-black">
                <p className="mb-2">Project Name *</p>
                <Input
                  type="text"
                  placeholder="e.g. Accountant Assistant LLM Fine-tuning Project"
                  onChange={(e: any) =>
                    setProjectData({ ...ProjectData, name: e.target.value })
                  }
                />
                <p className="mt-4 mb-2">Project Description *</p>
                <Input
                  type="text"
                  placeholder="e.g. This project will be used for finetuning my accountant assistant model."
                  onChange={(e: any) =>
                    setProjectData({
                      ...ProjectData,
                      description: e.target.value,
                    })
                  }
                />

                <Button
                  variant="default"
                  className="self-end mt-4"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitButtonDistabled}
                >
                  {"Create Project   →"}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function Workspace() {
  const { user } = useUser();

  const {
    value: projectsData,
    execute,
    status,
  } = useAsync(async () => {
    const response = await axios.get("/api/v1/projects");

    return response.data;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <a
          className="flex flex-row items-center p-5 ml-2 space-x-3 text-xl font-bold cursor-pointer hover:opacity-50"
          href={"/workspace"}
        >
          <Image
            src="/onellmlogocropped.png"
            alt="onellm logo"
            className="w-10"
            width={100}
            height={100}
          />

          <p className="text-[22px]">OneLLM</p>
        </a>
        <div className="flex flex-row items-center space-x-2 min-h-[60px] mr-7">
          <UserButton />
        </div>
      </div>
      <Separator />

      <div className="p-7">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <p className="mr-1 text-lg">Welcome back,</p>
            <p className="text-lg font-semibold">{user?.fullName}</p>
            <p className="mr-1 text-lg">!</p>
          </div>
          <div>
            <Button
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              + Create New Project
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 px-7 sm:grid-cols-3 lg:grid-cols-4">
        {status === "LOADING" ||
        projectsData?.length === 0 ||
        projectsData === null ? (
          <LoadingState />
        ) : (
          projectsData.map((project: Project) => (
            <ProjectCard
              key={project.id}
              projectId={project.id}
              projectName={project.name}
              description={project.description}
              lastEdited={project.updated_at}
              refetch={execute}
            />
          ))
        )}
      </div>
      <Toaster />
      <CreateNewProjectDialog
        isOpen={isDialogOpen}
        onClose={async () => {
          setIsDialogOpen(false);
          await execute();
        }}
      />
    </div>
  );
}

export default Workspace;