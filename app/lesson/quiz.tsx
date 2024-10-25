"use client";

import { useState } from "react";

import { challengeOptions, challenges } from "@/db/schema";

import { Header } from "./header";

type Props = {
  initialHearts: number;
  userSubscription: any; // TODO: Define userSubscription type
  initialLessonId: string;
  initialPercentage: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
};

export const Quiz = ({
  initialHearts,
  initialLessonId,
  userSubscription,
  initialPercentage,
  initialLessonChallenges,
}: Props) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
    </>
  );
};
