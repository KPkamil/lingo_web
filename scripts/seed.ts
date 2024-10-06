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

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);

    await db.insert(schema.courses).values([
      {
        id: randomUUID(),
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

    console.log("Seeding finished");
  } catch (err) {
    console.error(err);
    throw new Error("Failed to seed the database");
  }
};

main();
