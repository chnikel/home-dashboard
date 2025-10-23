import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: "file:data/test.db",
  },
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
});
