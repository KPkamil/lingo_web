import { toast } from "sonner";
import { useAudio } from "react-use";
import { useState, useTransition } from "react";

import { Status } from "@/types/lesson";
import { DEFAULT_HEARTS } from "@/constants/user";
import { reduceHearts } from "@/actions/user-progress";
import { challengeOptions, challenges } from "@/db/schema";
import { upsertChallengeProgress } from "@/actions/challenge-progress";

type Props = {
  initialHearts: number;
  initialLessonId: string;
  initialPercentage: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
};

export const useQuiz = ({
  initialHearts,
  initialLessonId,
  initialPercentage,
  initialLessonChallenges,
}: Props) => {
  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [status, setStatus] = useState<Status>("none");
  const [selectedOption, setSelectedOption] = useState<string>();
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges, setChallenges] = useState(initialLessonChallenges);

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [pending, startTransition] = useTransition();

  const [correctAudio, _c, correctControls] = useAudio({
    src: "/correct.wav",
  });

  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [finishAudio] = useAudio({
    autoPlay: true,
    src: "/finish.mp3",
  });

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: string) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);

      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);

      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) return;

    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((res) => {
            if (res?.error === "hearts") {
              console.error("Not enough hearts!");

              return;
            }

            setStatus("correct");
            correctControls.play();
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, DEFAULT_HEARTS));
            }
          })
          .catch(() => toast.error("Something went wrong! Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((res) => {
            if (res?.error === "hearts") {
              console.error("Missing hearts");

              return;
            }

            setStatus("wrong");
            incorrectControls.play();

            if (!res?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong! Please try again."));
      });
    }
  };

  return {
    hearts,
    status,
    options,
    pending,
    onSelect,
    lessonId,
    challenge,
    percentage,
    onContinue,
    challenges,
    finishAudio,
    correctAudio,
    selectedOption,
    incorrectAudio,
  };
};
