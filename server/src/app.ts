import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import tagRouter from "./routes/tagRouter";
import serviceRouter from "./routes/serviceRouter";
import groupRouter from "./routes/groupRouter";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../../dist")));

app.use("/services", serviceRouter);
app.use("/groups", groupRouter);
app.use("/tags", tagRouter);

export default app;
