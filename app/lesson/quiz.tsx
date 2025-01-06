"use client";

import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useRouter } from "next/navigation";

import { useQuiz } from "@/hooks/lesson/useQuiz";
import { POINTS_PER_CHALLENGE } from "@/constants/user";
import {
  challengeOptions,
  challenges as schemaChallenges,
  userSubscription,
} from "@/db/schema";

import { Footer } from "./footer";
import { Header } from "./header";
import { Challenge } from "./challenge";
import { ResolveCard } from "./resolve-card";
import { QuestionBubble } from "./question-bubble";

type Props = {
  initialHearts: number;
  initialLessonId: string;
  initialPercentage: number;
  initialLessonChallenges: (typeof schemaChallenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialHearts,
  initialLessonId,
  userSubscription,
  initialPercentage,
  initialLessonChallenges,
}: Props) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const {
    hearts,
    status,
    options,
    pending,
    onSelect,
    lessonId,
    challenge,
    challenges,
    percentage,
    onContinue,
    finishAudio,
    correctAudio,
    selectedOption,
    incorrectAudio,
  } = useQuiz({
    initialHearts,
    initialLessonId,
    initialPercentage,
    initialLessonChallenges,
  });

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="Finish"
            width={100}
            height={100}
            className="hidden lg:block"
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResolveCard
              variant="points"
              value={challenges.length * POINTS_PER_CHALLENGE}
            />
            <ResolveCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          status="completed"
          lessonId={lessonId}
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      {correctAudio}
      {incorrectAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                status={status}
                options={options}
                disabled={pending}
                onSelect={onSelect}
                type={challenge.type}
                selectedOption={selectedOption}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        status={status}
        onCheck={onContinue}
        disabled={!selectedOption || pending}
      />
    </>
  );
};
