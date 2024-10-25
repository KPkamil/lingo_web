import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import {
  getUnits,
  getUserProgress,
  getCourseProgress,
  getLessonPercentage,
} from "@/db/queries";

import { Unit } from "./unit";
import { Header } from "./header";

const page = async () => {
  const unitsDataPromise = getUnits();
  const userProgressPromise = getUserProgress();
  const courseProgressPromise = getCourseProgress();
  const lessonPercentagePromise = getLessonPercentage();

  const [units, userProgress, courseProgress, lessonPercentage] =
    await Promise.all([
      unitsDataPromise,
      userProgressPromise,
      courseProgressPromise,
      lessonPercentagePromise,
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
          hasActiveSubscription={false}
          activeCourse={userProgress.activeCourse}
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
