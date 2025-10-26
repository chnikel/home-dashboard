import express from "express";
import db from "../db";
import { NEED_REFACTOR_getServices } from "./serviceRouter";

const DEFAULT_GROUP_ID = "null";

const groupRouter = express.Router();

groupRouter.get("/groups", async (req, res) => {
  const includeServices = req.query.services == "true";

  const rawGroups = await db.allGroups();

  const groupsWithDefaultGroup = [
    ...rawGroups,
    { id: null, title: "", services: [] },
  ];

  if (!includeServices) {
    const groups = groupsWithDefaultGroup.map((entry) => {
      return {
        id: entry.id,
        title: entry.title,
      };
    });

    res.json(groups);

    return;
  }

  const services = await NEED_REFACTOR_getServices();

  const servicesGrouped = services.reduce<{
    [key: string]: (typeof services)[0][];
  }>((acc, service) => {
    (acc[service.groupId || DEFAULT_GROUP_ID] ??= []).push(service);
    return acc;
  }, {});

  const groups = groupsWithDefaultGroup.map((entry) => {
    return {
      id: entry.id,
      title: entry.title,
      services: servicesGrouped[entry.id || DEFAULT_GROUP_ID] || [],
    };
  });

  res.json(groups);
});

groupRouter.post("/groups", async (req, res) => {
  const data = {
    title: req.body.title,
  };

  await db.insertGroup(data);

  res.json({ message: "Gruppe erfolgreich hinzugefügt" });
});

groupRouter.put("/groups/:id", async (req, res) => {
  const id = Number(req.params.id);

  const data = {
    title: req.body.title,
  };

  await db.updateGroup(id, data);

  res.json({ message: "Gruppe erfolgreich aktualisiert" });
});

groupRouter.delete("/groups/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.deleteGroup(id);
  await db.clearGroup(id);

  res.json({ message: "Gruppe erfolgreich gelöscht" });
});

export default groupRouter;
