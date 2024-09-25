"use client";

import { courses } from "@/db/schema";

import { Card } from "./card";

type Props = {
  activeCourseId: string;
  courses: (typeof courses.$inferSelect)[];
};

export const List = ({ activeCourseId, courses }: Props) => {
  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          disabled={false}
          onClick={() => {}}
          title={course.title}
          imageSrc={course.imageSrc}
          active={activeCourseId === course.id}
        />
      ))}
    </div>
  );
};
