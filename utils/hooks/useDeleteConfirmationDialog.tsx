"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AlertDialogDemo({
  open,
  setOpen,
  onConfirm,
  onClose,
  onCancel,
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  onConfirm?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        if (e === false) {
          onClose && onClose();
        }
      }}
    >
      {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              onCancel && onCancel();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm && onConfirm();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function useDeleteConfirmationDialog() {
  const [open, setOpen] = React.useState(false);

  const DialogConfimationCompoment = ({
    onConfirm,
    onClose,
    onCancel,
  }: {
    onConfirm?: () => void;
    onClose?: () => void;
    onCancel?: () => void;
  }) => (
    <AlertDialogDemo
      open={open}
      setOpen={setOpen}
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
    />
  );

  return {
    DialogConfimationCompoment,
    setOpen,
  };
}

export default useDeleteConfirmationDialog;
