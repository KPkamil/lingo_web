"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/use-exit-modal";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

export const ExitModal = () => {
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { isOpen, close } = useExitModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex item-center w-full justify-center mb-5">
            <Image src="/mascot_sad.svg" alt="Mascot" height={80} width={80} />
          </div>
        </DialogHeader>
        <DialogTitle className="text-center font-bold text-2xl">
          Wait, don&apos;t go!
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          You&apos;re about to leave the lesson. Are you sure?
        </DialogDescription>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              onClick={close}
              size="lg"
              variant="primary"
              className="w-full"
            >
              Keep learning
            </Button>
            <Button
              onClick={() => {
                close();
                router.push("/learn");
              }}
              size="lg"
              variant="dangerOutline"
              className="w-full"
            >
              End session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
