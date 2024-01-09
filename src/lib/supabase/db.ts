import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

if (!process.env.DB_URL) console.log(new Error("Cannot connect to db"));

const client = postgres(process.env.DB_URL as string);
const db = drizzle(client, { schema });
const migrateDb = async () => {
  try {
    console.log("Migration started!");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migration finished succesfully!");
  } catch (error) {
    console.log(new Error(`Cannot migrate data ${error}`));
  }
};
migrateDb();
export default db;
