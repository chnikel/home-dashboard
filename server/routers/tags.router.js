import express from "express";
import ServiceTag from "../models/ServiceTag.js";
import { safeAwait } from "../utils/safe-await.js";

const router = express.Router();

router.get("/tags", async (req, res, next) => {
  const [err, data] = await safeAwait(ServiceTag.all());

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
  const tag = new ServiceTag({
    name: req.body.name,
    color: req.body.color,
  });

  const [err] = await safeAwait(tag.save());

  if (err) {
    next({ message: "Tag existiert bereits" });
    return;
  }

  res.json({ message: "Tag erfolgreich hinzugefügt" });
});

export default router;
