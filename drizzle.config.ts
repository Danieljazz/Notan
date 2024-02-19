import { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) console.log("Cannot migrate db :(");

export default {
  schema: "./src/lib/supabase/schema.ts",
  out: "./migrations",
  driver: "mysql",
  dbCredentials: {
    connectionString: process.env.DB_URL || "",
  },
} satisfies Config;
