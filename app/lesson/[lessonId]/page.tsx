import { redirect } from "next/navigation";

import { getLesson, getUserProgress } from "@/db/queries";

import { Quiz } from "../quiz";

type Props = {
  params: {
    lessonId: string;
  };
};

const LessonIdPage = async ({ params }: Props) => {
  const userProgressPromise = getUserProgress();
  const lessonPromise = getLesson(params.lessonId);

  const [lesson, userProgress] = await Promise.all([
    lessonPromise,
    userProgressPromise,
  ]);

  if (!lesson || !userProgress) redirect("/learn");

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      userSubscription={null} // TODO: Add user subscription
      initialLessonId={lesson.id}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      initialLessonChallenges={lesson.challenges}
    />
  );
};

export default LessonIdPage;
