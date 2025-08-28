import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

import db from "./db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logger.js";
import tagsRouter from "./routers/tags.router.js";
import groupsRouter from "./routers/groups.router.js";

app.use(logger);
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../dist")));

export const getServices = async () => {
  const data = await db.allServices();

  const services = await Promise.all(
    data.map(async (entry) => {
      const tags = await db.allTagsForService(entry.id);

      return {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        link: entry.link,
        icon_url: entry.icon_url,
        icon_wrap: entry.icon_wrap ? true : false,
        enabled: entry.status_enabled ? true : false,
        groupId: entry.group_id,
        tags,
      };
    })
  );

  return services;
};

app.get("/services", async (req, res) => {
  const services = await getServices();

  const groupBy = req.query.groupBy;

  if (groupBy) {
    const servicesGrouped = services.reduce((acc, service) => {
      (acc[service[groupBy]] ??= []).push(service);
      return acc;
    }, {});

    res.json(servicesGrouped);
    return;
  }

  res.json(services);
});

app.post("/services", async (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon_url,
    icon_wrap: req.body.icon_wrap,
    status_enabled: req.body.enabled,
    groupId: req.body.groupId,
  };

  const serviceId = await db.insertService(data);

  const tags = req.body.tags || [];

  tags.forEach((tag) => {
    db.tagToService(tag, serviceId);
  });

  res.json({ message: "Service erfolgreich hinzugefügt" });
});

app.post("/services/:id/group/:group", (req, res) => {
  const id = req.params.id;
  const groupId = req.params.group;

  db.serviceToGroup(id, groupId);

  res.json({ message: "Service erfolgreich der Gruppe zugewiesen" });
});

app.put("/services/:id", async (req, res) => {
  const serviceId = req.params.id;

  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon_url,
    icon_wrap: req.body.icon_wrap,
    status_enabled: req.body.enabled,
    groupId: req.body.groupId,
  };

  await db.updateService(serviceId, data);

  const updatedTags = req.body.tags || [];
  const currentTags = await db.allTagsForService(serviceId);

  updatedTags.forEach((tag) => {
    const foundTag = currentTags.find((t) => t.name === tag);

    if (foundTag) {
      return;
    }

    db.tagToService(tag, serviceId);
  });

  currentTags.forEach((t) => {
    const foundTag = updatedTags.find((tag) => tag === t.name);

    if (foundTag) {
      return;
    }

    db.removeTagFromService(t.name, serviceId);
  });

  res.json({ message: "Service erfolgreich aktualisiert" });
});

app.delete("/services/:id", (req, res) => {
  const id = req.params.id;

  db.deleteService(id);

  res.json({ message: "Service erfolgreich gelöscht" });
});

app.use(tagsRouter);
app.use(groupsRouter);

app.post("/tags/:name/service/:service", (req, res) => {
  const name = req.params.name;
  const serviceId = req.params.service;

  db.tagToService(name, serviceId);

  res.json({ message: "Tag erfolgreich dem Service zugewiesen" });
});

app.delete("/tags/:name/service/:service", (req, res) => {
  const name = req.params.name;
  const serviceId = req.params.service;

  db.removeTagFromService(name, serviceId);

  res.json({ message: "Tag erfolgreich dem Service zugewiesen" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
