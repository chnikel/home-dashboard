import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import tagRouter from "./routes/tagRouter";
import serviceRouter from "./routes/serviceRouter";
import groupRouter from "./routes/groupRouter";
import pingRouter from "./routes/pingRouter";
import imageRouter from "./routes/imageRouter";
import config from "./config";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../../dist")));
app.use("/public", express.static(config.publicDir));

app.use("/api/services", serviceRouter);
app.use("/api/ping", pingRouter);
app.use("/api/groups", groupRouter);
app.use("/api/tags", tagRouter);
app.use("/api/images", imageRouter);

export default app;
