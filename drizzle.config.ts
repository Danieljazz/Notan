import { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.HOST) console.log("Cannot find host.");

export default {
  schema: "./src/lib/mysql/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
  },
} satisfies Config;
