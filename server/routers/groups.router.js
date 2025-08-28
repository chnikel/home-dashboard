import express from "express";
import ServiceGroup from "../models/ServiceGroup.js";
import { safeAwait } from "../utils/safe-await.js";
import { getServices } from "../server.js";
import { groupBy } from "../utils/group-by.js";
import db from "../db.js";

const router = express.Router();

router.get("/groups", async (req, res, next) => {
  const includeServices = req.query.services == "true";

  const [err, rawGroups] = await safeAwait(ServiceGroup.all());

  if (err) {
    next(err);
    return;
  }

  const groupsWithDefaultGroup = [
    ...rawGroups,
    new ServiceGroup({ id: null, title: "" }),
  ];

  if (!includeServices) {
    res.json(groupsWithDefaultGroup);
    return;
  }

  const services = await getServices();

  const servicesGrouped = await groupBy(services, "groupId");

  const groups = groupsWithDefaultGroup.map((group) => {
    group.services = servicesGrouped[group.id] || [];
    return group;
  });

  res.json(groups);
});

router.post("/groups", async (req, res, next) => {
  const data = {
    title: req.body.title,
  };

  const group = new ServiceGroup({
    title: req.body.title,
  });

  const [err] = await safeAwait(group.save());

  if (err) {
    next();
    return;
  }

  res.json({ message: "Gruppe erfolgreich hinzugefügt" });
});

router.put("/groups/:id", async (req, res, next) => {
  const group = new ServiceGroup({
    id: req.params.id,
    title: req.body.title,
  });

  const [err] = await safeAwait(group.save());

  if (err) {
    next();
    return;
  }

  res.json({ message: "Gruppe erfolgreich aktualisiert" });
});

router.delete("/groups/:id", async (req, res, next) => {
  const id = req.params.id;

  const group = new ServiceGroup({ id });

  const [err] = await safeAwait(group.delete());

  if (err) {
    next();
    return;
  }

  db.clearGroup(id);

  res.json({ message: "Gruppe erfolgreich gelöscht" });
});

export default router;
