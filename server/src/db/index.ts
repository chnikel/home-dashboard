import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)) {
  console.log("🗂️  Create data folder...");
  fs.mkdirSync(dataFolder);
}


const dbPath = path.join(dataFolder, "test.db");
const sqlite = new Database(dbPath);
const db = drizzle({ client: sqlite, casing: "snake_case" });

export { db };
