import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import {
  getUnits,
  getUserProgress,
  getCourseProgress,
  getLessonPercentage,
  getUserSubscription,
} from "@/db/queries";

import { Unit } from "./unit";
import { Header } from "./header";

const page = async () => {
  const unitsDataPromise = getUnits();
  const userProgressPromise = getUserProgress();
  const courseProgressPromise = getCourseProgress();
  const userSubscriptionPromise = getUserSubscription();
  const lessonPercentagePromise = getLessonPercentage();

  const [
    units,
    userProgress,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    unitsDataPromise,
    userProgressPromise,
    courseProgressPromise,
    lessonPercentagePromise,
    userSubscriptionPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse || !courseProgress) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          hearts={userProgress.hearts}
          points={userProgress.points}
          activeCourse={userProgress.activeCourse}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              title={unit.title}
              lessons={unit.lessons}
              description={unit.description}
              activeLessonPercentage={lessonPercentage}
              activeLesson={courseProgress.activeLesson}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default page;
