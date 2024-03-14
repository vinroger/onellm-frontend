"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy, DeleteIcon, LoaderIcon, Trash2 } from "lucide-react";
import Layout from "@/components/TopLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Key } from "@/types/table";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sensitizeKey } from "@/utils/functions/string";
import { Card } from "@/components/ui/card";
import { toHumanDateString } from "@/utils/functions/date";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import useCopyToClipboard from "@/utils/hooks/useCopyPaste";
import { CopyButton } from "@/components/copybutton";
import { useProjectContext } from "@/utils/contexts/useProject";

const API_URL = "/api/v1/keys";

const fetchKeys = async (projectId: string) => {
  const response = await axios.get("/api/v1/keys", {
    params: {
      projectId,
    },
  });
  return response.data.keys;
};

const deleteKey = async (keyId: string) => {
  await axios.delete(`/api/v1/keys/${keyId}`);
};

const TableComponent = ({
  keys,
  onDeleteKey,
}: {
  keys: Key[];
  onDeleteKey: () => void;
}) => {
  const handleDelete = async (keyId: string) => {
    await deleteKey(keyId);
    onDeleteKey();
  };
  const hasKey = keys.length > 0;

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-lg font-medium text-neutral-600">
          You have not created any API keys yet.
        </p>
      </div>
    );
  }
  return (
    <Table className="mt-2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]" colSpan={4}>
            Name
          </TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead>key</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map((key) => (
          <TableRow key={key.key}>
            <TableCell className="font-medium" colSpan={4}>
              {key.name}
            </TableCell>
            <TableCell>{toHumanDateString(new Date(key.created_at))}</TableCell>
            <TableCell>
              {toHumanDateString(new Date(key.last_used ?? ""))}
            </TableCell>
            <TableCell>
              <div className="flex flex-row items-center space-x-3">
                <div>{sensitizeKey(key.key!, 2, 3, 3)}</div>
                <CopyButton
                  textToCopy={key.key ?? ""}
                  className="w-4 h-4 text-green-700"
                  tagStyle={{ transform: "translateX(6rem)" }}
                />
              </div>
            </TableCell>
            <TableCell colSpan={1}>
              <div className="flex flex-row items-center space-x-2">
                <button type="button" onClick={() => handleDelete(key.id)}>
                  <Trash2 className="w-4 text-red-700" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function KeysTable() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [open, setOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(false);

  const { projectId } = useProjectContext();

  const loadKeys = async () => {
    setLoading(true);
    const fetchedKeys = await fetchKeys(projectId);
    setKeys(fetchedKeys);
    setLoading(false);
  };
  useEffect(() => {
    loadKeys();
  }, []);

  const handleCreateKey = async () => {
    try {
      await axios.post(API_URL, { name: newKeyName });
      setNewKeyName("");
      setOpen(false);
      loadKeys();
    } catch (error) {
      console.error("Error creating key:", error);
    }
  };

  return (
    <div className="p-4">
      <Card className="w-3/4 p-7">
        <div>
          <h1 className="p-0 m-0 text-lg font-bold">Analytics API Keys</h1>
          <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
            Create Analytics API Key to access the OneLLM API.
          </p>
        </div>
        <Button variant="default" onClick={() => setOpen(true)}>
          + Create New Key
        </Button>
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
          <DialogContent className="w-[850px]">
            <DialogHeader>
              <DialogTitle>Analytics Key</DialogTitle>
            </DialogHeader>
            <p>Enter a name for your new OneLLM analytics API key.</p>
            <Input
              placeholder="My New AI Application Key"
              autoFocus
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateKey}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {!loading ? (
          <TableComponent keys={keys} onDeleteKey={() => loadKeys()} />
        ) : (
          <LoaderIcon className="animate-spin" />
        )}
      </Card>
    </div>
  );
}

export default KeysTable;
