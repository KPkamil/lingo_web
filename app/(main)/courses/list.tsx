"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { courses, userProgress } from "@/db/schema";
import { upsertUserProgress } from "@/actions/user-progress";

import { Card } from "./card";
import { toast } from "sonner";

type Props = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId: typeof userProgress.$inferInsert.activeCourseId;
};

export const List = ({ activeCourseId, courses }: Props) => {
  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const onClick = (id: string) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          onClick={onClick}
          disabled={pending}
          title={course.title}
          imageSrc={course.imageSrc}
          active={activeCourseId === course.id}
        />
      ))}
    </div>
  );
};
