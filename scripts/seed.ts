import "dotenv/config";

import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database...");

    await db.delete(schema.units);
    await db.delete(schema.courses);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    const spanishUUID = randomUUID();

    await db.insert(schema.courses).values([
      {
        id: spanishUUID,
        title: "Spanish",
        imageSrc: "./es.svg",
      },
      {
        id: randomUUID(),
        title: "Italian",
        imageSrc: "./it.svg",
      },
      {
        id: randomUUID(),
        title: "French",
        imageSrc: "./fr.svg",
      },
      {
        id: randomUUID(),
        title: "Croatian",
        imageSrc: "./hr.svg",
      },
    ]);

    const unitUUID = randomUUID();
    await db.insert(schema.units).values([
      {
        id: unitUUID,
        courseId: spanishUUID,
        order: 1,
        title: "Unit 1",
        description: "Learn the basics of Spanish",
      },
    ]);

    const lessonUUID = randomUUID();
    const lessonUUID2 = randomUUID();
    await db.insert(schema.lessons).values([
      {
        id: lessonUUID,
        unitId: unitUUID,
        order: 1,
        title: "Nouns",
      },
      {
        id: lessonUUID2,
        unitId: unitUUID,
        order: 2,
        title: "Verbs",
      },
      {
        id: randomUUID(),
        unitId: unitUUID,
        order: 3,
        title: "Verbs",
      },
      {
        id: randomUUID(),
        unitId: unitUUID,
        order: 4,
        title: "Verbs",
      },
      {
        id: randomUUID(),
        unitId: unitUUID,
        order: 5,
        title: "Verbs",
      },
    ]);

    const challengeUUID = randomUUID();
    const challengeUUID2 = randomUUID();
    const challengeUUID3 = randomUUID();
    await db.insert(schema.challenges).values([
      {
        id: challengeUUID,
        lessonId: lessonUUID,
        order: 1,
        type: "SELECT",
        question: 'Which one of these is the "the man"?',
      },
      {
        id: challengeUUID2,
        lessonId: lessonUUID,
        order: 2,
        type: "ASSIST",
        question: '"the man"',
      },
      {
        id: challengeUUID3,
        lessonId: lessonUUID,
        order: 3,
        type: "SELECT",
        question: 'Which one of these is the "the robot"?',
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: randomUUID(),
        challengeId: challengeUUID,
        correct: true,
        text: "el hombre",
        imageSrc: "/man.svg",
        audioSrc: "/es_man.mp3",
      },
      {
        id: randomUUID(),
        challengeId: challengeUUID,
        correct: false,
        text: "la mujer",
        imageSrc: "/woman.svg",
        audioSrc: "/es_woman.mp3",
      },
      {
        id: randomUUID(),
        challengeId: challengeUUID,
        correct: false,
        text: "el robot",
        imageSrc: "/robot.svg",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: randomUUID(),
        challengeId: challengeUUID2,
        correct: true,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        id: randomUUID(),
        challengeId: challengeUUID2,
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        id: randomUUID(),
        challengeId: challengeUUID2,
        correct: false,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: randomUUID(),
        challengeId: challengeUUID3,
        correct: false,
        text: "el hombre",
        imageSrc: "/man.svg",
        audioSrc: "/es_man.mp3",
      },
      {
        id: randomUUID(),
        challengeId: challengeUUID3,
        correct: false,
        text: "la mujer",
        imageSrc: "/woman.svg",
        audioSrc: "/es_woman.mp3",
      },
      {
        id: randomUUID(),
        challengeId: challengeUUID3,
        correct: true,
        text: "el robot",
        imageSrc: "/robot.svg",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: randomUUID(),
        lessonId: lessonUUID2,
        order: 1,
        type: "SELECT",
        question: 'Which one of these is the "the man"?',
      },
      {
        id: randomUUID(),
        lessonId: lessonUUID2,
        order: 2,
        type: "ASSIST",
        question: '"the man"',
      },
      {
        id: randomUUID(),
        lessonId: lessonUUID2,
        order: 3,
        type: "SELECT",
        question: 'Which one of these is the "the robot"?',
      },
    ]);

    console.log("Seeding finished");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to seed the database");
  }
};

main();
