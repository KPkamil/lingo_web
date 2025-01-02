"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

export const HeartsModal = () => {
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { isOpen, close } = useHeartsModal();

  useEffect(() => setIsClient(true), []);

  const onClick = () => {
    close();
    router.push("/store");
  };

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex item-center w-full justify-center mb-5">
            <Image src="/mascot_bad.svg" alt="Mascot" height={80} width={80} />
          </div>
        </DialogHeader>
        <DialogTitle className="text-center font-bold text-2xl">
          You ran out of hearts!
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          Get Pro for unlimited hearts, or purchase them in the store.
        </DialogDescription>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              onClick={onClick}
              size="lg"
              variant="primary"
              className="w-full"
            >
              Get unlimited hearts
            </Button>
            <Button
              onClick={close}
              size="lg"
              className="w-full"
              variant="primaryOutline"
            >
              No thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
