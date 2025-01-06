import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "../quiz";

type Props = {
  params: {
    lessonId: string;
  };
};

const LessonIdPage = async ({ params }: Props) => {
  const userProgressPromise = getUserProgress();
  const lessonPromise = getLesson(params.lessonId);
  const userSubscriptionPromise = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonPromise,
    userProgressPromise,
    userSubscriptionPromise,
  ]);

  if (!lesson || !userProgress) redirect("/learn");

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialHearts={userProgress.hearts}
      userSubscription={userSubscription}
      initialPercentage={initialPercentage}
      initialLessonChallenges={lesson.challenges}
    />
  );
};

export default LessonIdPage;
