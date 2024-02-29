import { migrate } from "drizzle-orm/mysql2/migrator";
import db from "./db";
const migrateDb = async () => {
  try {
    console.log("Migration started!");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration finished succesfully!");
  } catch (error) {
    console.log(new Error(`Cannot migrate data ${error}`));
  }
};
migrateDb();
