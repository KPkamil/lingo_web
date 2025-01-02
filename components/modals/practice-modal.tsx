"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePracticeModal } from "@/store/use-practice-modal";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false);

  const { isOpen, close } = usePracticeModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex item-center w-full justify-center mb-5">
            <Image src="/heart.svg" alt="Heart" height={100} width={100} />
          </div>
        </DialogHeader>
        <DialogTitle className="text-center font-bold text-2xl">
          Practice lesson
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          Use practice lessons to regain hearts and points. You cannot lose
          hearts or points in practice lessons.
        </DialogDescription>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              onClick={close}
              size="lg"
              className="w-full"
              variant="primary"
            >
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
