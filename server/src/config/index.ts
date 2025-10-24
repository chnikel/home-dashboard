import "dotenv/config";

export default {
  port: process.env.PORT || 3000,
  database: {
    filename: process.env.DB_FILENAME || "test.db",
  },
};
