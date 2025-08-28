import express from "express";
import Tag from "../models/Tag.js";
import { safeAwait } from "../utils/safe-await.js";

const router = express.Router();

router.get("/tags", async (req, res, next) => {
  const [err, data] = await safeAwait(Tag.all());

  if (err) {
    next(err);
    return;
  }

  const tags = data.map((entry) => ({
    id: entry.id,
    name: entry.name,
    color: entry.color,
  }));

  res.json(tags);
});

router.post("/tags", async (req, res, next) => {
  const tag = new Tag({
    name: req.body.name,
    color: req.body.color,
  });

  const [err] = await safeAwait(tag.save());

  if (err) {
    next(
      err.code === "SQLITE_CONSTRAINT"
        ? { message: "Tag existiert bereits" }
        : err
    );
    return;
  }

  res.json({ message: "Tag erfolgreich hinzugefügt" });
});

export default router;
