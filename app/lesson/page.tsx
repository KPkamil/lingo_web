import { redirect } from "next/navigation";

import { getLesson, getUserProgress } from "@/db/queries";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const lessonPromise = getLesson();
  const userProgressPromise = getUserProgress();

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

export default LessonPage;
