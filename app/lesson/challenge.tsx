import { cn } from "@/lib/utils";
import { Status } from "@/types/lesson";
import { challengeOptions, challenges } from "@/db/schema";

import { Card } from "./card";

type Props = {
  status: Status;
  disabled?: boolean;
  selectedOption?: string;
  onSelect: (id: string) => void;
  type: (typeof challenges.$inferSelect)["type"];
  options: (typeof challengeOptions.$inferSelect)[];
};

export const Challenge = ({
  type,
  status,
  options,
  onSelect,
  disabled,
  selectedOption,
}: Props) => {
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          type={type}
          status={status}
          text={option.text}
          disabled={disabled}
          shortcut={`${i + 1}`}
          imageSrc={option.imageSrc}
          audioSrc={option.audioSrc}
          onClick={() => onSelect(option.id)}
          selected={selectedOption === option.id}
        />
      ))}
    </div>
  );
};
