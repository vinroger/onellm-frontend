/* eslint-disable camelcase */

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import useAsync from "@/utils/hooks/useAsync";
import LoadingState from "@/components/LoadingState";
import { sensitizeKey } from "@/utils/functions/string";
import { ModelProviderApiKey } from "@/types/table";
import { Pencil } from "lucide-react";
import { useProjectContext } from "@/utils/contexts/useProject";
import APIKeySettings from "./apikeysettings";
import InviteMembersPage from "./invitemembers";

// TODO ADD ANTROPIC, GEMINI, LLaMa 2, search openai

function GeneralSettings() {
  return <div>General</div>;
}

const MainComponent = ({ selectedTab }: { selectedTab: string }) => {
  if (selectedTab === "general") {
    return <GeneralSettings />;
  }
  if (selectedTab === "apikeys") {
    return <APIKeySettings />;
  }
  if (selectedTab === "invite") {
    return <InviteMembersPage />;
  }
  return null;
};

function WrappedMainComponent({ selectedTab }: { selectedTab: string }) {
  return (
    <Card className="max-w-[700px] min-w-[700px] p-5 ml-10 min-h-[500px]">
      <MainComponent selectedTab={selectedTab} />
    </Card>
  );
}

function MenuCard({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}) {
  return (
    <div>
      <Card className="w-[280px] h-fit p-5 flex flex-col space-y-2">
        <p className="mb-2 ml-2 text-sm font-bold">Menu</p>
        <Separator className="" />
        <div className="mt-2" />
        <Button
          variant="ghost"
          className={cn(
            "h-[40px] px-4 w-fit",
            selectedTab === "general" && "bg-neutral-50 font-bold"
          )}
          onClick={() => setSelectedTab("general")}
        >
          General
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "h-[40px] px-4 w-fit",
            selectedTab === "apikeys" && "bg-neutral-50 font-bold"
          )}
          onClick={() => setSelectedTab("apikeys")}
        >
          API Keys
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "h-[40px] px-4 w-fit",
            selectedTab === "invite" && "bg-neutral-50 font-bold"
          )}
          onClick={() => setSelectedTab("invite")}
        >
          Invite Members
        </Button>
      </Card>
    </div>
  );
}

function Settings() {
  const [selectedTab, setSelectedTab] = React.useState("apikeys");
  return (
    <div className="p-7">
      <h1 className="p-0 m-0 text-lg font-bold">Settings</h1>
      <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
        Change config, api keys and more.
      </p>
      <Separator className="" />

      <div className="flex flex-row mt-4">
        <MenuCard selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <WrappedMainComponent selectedTab={selectedTab} />
      </div>
    </div>
  );
}

export default Settings;
