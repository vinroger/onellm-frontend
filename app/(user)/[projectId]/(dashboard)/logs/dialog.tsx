"use client";

/* eslint-disable react/no-array-index-key */
import { Braces } from "lucide-react";
import { Chat, Log } from "@/types/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toTitleCase } from "@/utils/functions/string";

const CodeRenderer = ({ value }: { value: string }) => {
  return (
    <pre className="p-4 overflow-scroll text-sm text-left whitespace-pre-wrap bg-gray-100 rounded-lg text-muted-foreground">
      <code>{value}</code>
    </pre>
  );
};

const MenubarComponent = ({ chat }: { chat: Chat }) => {
  return (
    <Tabs defaultValue="formatted" className="max-w-[800px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="formatted">Formatted</TabsTrigger>
        <TabsTrigger value="json">
          <Braces className="h-4" />
          JSON
        </TabsTrigger>
      </TabsList>
      <TabsContent value="formatted">
        {chat &&
          chat.map((message, index) => {
            return (
              <div key={index} className="flex max-w-full mb-3 space-x-2">
                <div className="flex flex-col max-w-full">
                  <p className="mb-1 font-semibold">
                    {toTitleCase(message.role)}
                  </p>
                  <CodeRenderer value={message.content} />
                </div>
              </div>
            );
          })}
      </TabsContent>
      <TabsContent value="json">
        <CodeRenderer value={JSON.stringify(chat, null, 2)} />
      </TabsContent>
    </Tabs>
  );
};

export const DetailDialog = ({
  isOpen,
  onClose,
  log,
}: {
  isOpen: boolean;
  onClose: () => void;
  log: Log | null;
}) => {
  if (!isOpen) return null; // Only render the dialog if it's open

  return (
    <div className="min-w-screen">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[850px]">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <table className="detail-table">
              <tbody>
                {log !== null &&
                  Object.entries(log).map(([key, value]) => {
                    const forbiddenKeys = [
                      "chat",
                      "onellm_api_key",
                      "owner_id",
                      "model_provider_api_key",
                    ];
                    if (forbiddenKeys.includes(key)) return null;
                    return (
                      <tr key={key}>
                        <th className="pr-5 detail-key text-start">
                          {key.replace(/_/g, " ")}
                        </th>
                        <td className="detail-value">
                          {JSON.stringify(value)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </DialogDescription>
          <MenubarComponent chat={log?.chat as Chat} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
