import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import db from "./db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logger.js";
import tagsRouter from "./routers/tags.router.js";
import groupsRouter from "./routers/groups.router.js";
import ServiceTag from "./models/ServiceTag.js";
import { safeAwait } from "./utils/safe-await.js";
import Tag from "./models/Tag.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

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

  tags.map(async (tag) => {
    const serviceTag = new ServiceTag({ serviceId, tag });

    const [err] = await safeAwait(serviceTag.save());
    if (err) {
      console.log("UNHANDLED_ERROR", err);
    }
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

  const updatedTags = await Promise.all(
    (req.body.tags || []).map((name) => Tag.fromName(name))
  );
  const currentTags = (await db.allTagsForService(serviceId)).map(
    (tag) => new Tag(tag)
  );

  await Promise.all(
    updatedTags.map(async (tag) => {
      const foundTag = currentTags.find((t) => {
        return t.name === tag;
      });

      if (foundTag) {
        return;
      }

      const serviceTag = new ServiceTag({ serviceId, tag });

      const [err] = await safeAwait(serviceTag.save());
      if (err) {
        console.log("UNHANDLED_ERROR", err);
      }
    })
  );

  currentTags.map(async (tag) => {
    const foundTag = currentTags.find((t) => {
      return t.name === tag;
    });

    if (foundTag) {
      return;
    }

    const serviceTag = new ServiceTag({ serviceId, tag });

    const [err] = await safeAwait(serviceTag.delete());
    if (err) {
      console.log("UNHANDLED_ERROR", err);
    }
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
