import { drizzle } from "drizzle-orm/mysql2";
import "mysql2";
import { createConnection } from "mysql2";
import * as schema from "./schema";

const connection = createConnection({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
});

const db = drizzle(connection, { schema: schema, mode: "default" });
export default db;
