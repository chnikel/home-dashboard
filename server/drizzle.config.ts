import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: "./src/data/test.db",
  },
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
});
