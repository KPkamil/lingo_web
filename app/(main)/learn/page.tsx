import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { getUnits, getUserProgress } from "@/db/queries";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";

import { Header } from "./header";

const page = async () => {
  const unitsDataPromise = getUnits();
  const userProgressPromise = getUserProgress();

  const [units, userProgress] = await Promise.all([
    unitsDataPromise,
    userProgressPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
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
      </FeedWrapper>
    </div>
  );
};

export default page;
