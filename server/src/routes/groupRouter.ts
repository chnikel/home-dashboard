import express from "express";
import db from "../db";
import { Group } from "../db/schema";

const groupRouter = express.Router();

groupRouter.get("", async (req, res) => {
  const rawGroups = await db.allGroups();

  const groupsWithDefaultGroup: Group[] = [
    ...rawGroups,
    { id: -1, title: "" },
  ];

  const groups = groupsWithDefaultGroup.map((entry) => {
    return {
      id: entry.id,
      title: entry.title,
    };
  });

  res.json(groups);
});

groupRouter.post("", async (req, res) => {
  const data = {
    title: req.body.title,
  };

  await db.insertGroup(data);

  res.json({ message: "Gruppe erfolgreich hinzugefügt" });
});

groupRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const data = {
    title: req.body.title,
  };

  await db.updateGroup(id, data);

  res.json({ message: "Gruppe erfolgreich aktualisiert" });
});

groupRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.deleteGroup(id);
  await db.clearGroup(id);

  res.json({ message: "Gruppe erfolgreich gelöscht" });
});

export default groupRouter;
