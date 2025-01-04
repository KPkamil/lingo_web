import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { DEFAULT_HEARTS } from "@/constants/user";

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  units: many(units),
  userProgress: many(userProgress),
}));

export const units = pgTable("units", {
  id: text("id").primaryKey(),
  title: text("title").notNull(), // e.g. Unit 1
  order: integer("order").notNull(),
  description: text("description").notNull(), // e.g. Learn the basics of Spanish
  courseId: text("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
});

export const unitsRelations = relations(units, ({ one, many }) => ({
  lessons: many(lessons),
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
}));

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  unitId: text("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  challenges: many(challenges),
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: text("id").primaryKey(),
  order: integer("order").notNull(),
  question: text("question").notNull(),
  type: challengesEnum("type").notNull(),
  lessonId: text("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: text("id").primaryKey(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  challengeId: text("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(), // TODO: Confirm this doesn't break
  completed: boolean("completed").notNull().default(false),
  challengeId: text("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  points: integer("points").notNull().default(0),
  userName: text("user_name").notNull().default("User"),
  hearts: integer("hearts").notNull().default(DEFAULT_HEARTS),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: text("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscription", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});
