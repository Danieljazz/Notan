import { drizzle } from "drizzle-orm/mysql2";
import "mysql2";
import dotenv from "dotenv";
// import schema from "../../../drizzle/schema";
// import schema from "../../../drizzle/schema";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";

// if (!process.env.DB_URL) console.log(new Error("Cannot connect to db"));

const connection = createConnection({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_URL as string,
});

const db = drizzle(connection);
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
export default db;
