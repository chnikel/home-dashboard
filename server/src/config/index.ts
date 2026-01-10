import path from "path";

import "dotenv/config";

export default {
  port: process.env.PORT || 3000,
  database: {
    filename: process.env.DB_FILENAME || "test.db",
  },
  publicDir: path.join(__dirname, "../../public/")
};
