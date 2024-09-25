import "dotenv/config";
import type { Config } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: dbUrl,
  },
} satisfies Config;
