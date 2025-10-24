import { defineConfig } from "drizzle-kit";
import config from "./src/config";

export default defineConfig({
  dbCredentials: {
    url: `file:data/${config.database.filename}`,
  },
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
});
