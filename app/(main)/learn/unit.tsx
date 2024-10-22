import { lessons, units } from "@/db/schema";

import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type Props = {
  id: string;
  order: number;
  title: string;
  description: string;
  activeLessonPercentage: number;
  activeLesson?: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
  };
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
};

export const Unit = ({
  id,
  order,
  title,
  lessons,
  description,
  activeLesson,
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              index={index}
              id={lesson.id}
              locked={isLocked}
              current={isCurrent}
              totalCount={lessons.length - 1}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};
