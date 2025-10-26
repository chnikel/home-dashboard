import express from "express";
import db from "../db";
import { NewTag } from "../db/schema";

const userRouter = express.Router();

userRouter.get("", async (req, res) => {
  const data = await db.allTags();

  res.json(data);
});

userRouter.post("", async (req, res) => {
  const data: NewTag = {
    name: req.body.name,
    color: req.body.color,
    weight: Number(req.body.weight),
  };

  await db
    .insertTag(data)
    .then(() => {
      res.json({ message: "Tag erfolgreich hinzugefügt" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Es ist ein Fehler aufgetreten" });
    });
});

userRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const data: Partial<NewTag> = {
    color: req.body.color,
    weight: Number(req.body.weight),
  };

  const { changes } = await db.updateTag(id, data);

  if (changes > 0) {
    res.json({ message: "Tag erfolgreich aktualisiert" });
  } else {
    res.json({ message: "Es ist ein Fehler aufgetreten" });
  }
});

userRouter.post("/:id/toggle/:serviceId", async (req, res) => {
  const tagId = Number(req.params.id);
  const serviceId = Number(req.params.serviceId);

  const { changes } = await db.serviceToggleTag(serviceId, tagId);

  if (changes > 0) {
    res.json({ message: "Tag erfolgreich aktualisiert" });
  } else {
    res.json({ message: "Es ist ein Fehler aufgetreten" });
  }
});

export default userRouter;
