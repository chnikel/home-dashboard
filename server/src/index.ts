import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import { NewService, NewTag } from "./db/schema";

import db from "./db";
import config from "./config";

console.log(`ℹ️  Port: ${config.port}`);
console.log(`ℹ️  Database: ${config.database.filename}`);

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../../dist")));

const DEFAULT_GROUP_ID = "null";

const getServices = async () => {
  const data = await db.allServices();

  const services = await Promise.all(
    data.map(async (entry) => {
      const tags = await db.allTagsForService(entry.id);

      return {
        id: entry.id,
        title: entry.title,
        description: entry.description,
        link: entry.link,
        icon_url: entry.iconUrl,
        icon_wrap: entry.iconWrap ? true : false,
        enabled: entry.enabled ? true : false,
        groupId: entry.groupId,
        tags,
      };
    })
  );

  return services;
};

app.get("/services", async (req, res) => {
  const services = await getServices();

  const groupBy = req.query.groupBy as string | undefined;

  if (groupBy) {
    const servicesGrouped = services.reduce((acc: any, service: any) => {
      (acc[service[groupBy]] ??= []).push(service);
      return acc;
    }, {});

    res.json(servicesGrouped);
    return;
  }

  res.json(services);
});

app.post("/services", async (req, res) => {
  const data: NewService = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    iconUrl: req.body.icon_url,
    iconWrap: req.body.icon_wrap,
    enabled: req.body.enabled,
    groupId: req.body.groupId,
  };

  const serviceId = await db.insertService(data);

  const tags: string[] = req.body.tags || [];

  await Promise.all(
    tags.map((tag) => {
      return db.tagToService(tag, Number(serviceId.lastInsertRowid));
    })
  );

  res.json({ message: "Service erfolgreich hinzugefügt" });
});

app.post("/services/:id/group/:group", async (req, res) => {
  const id = Number(req.params.id);
  const groupId = Number(req.params.group);

  await db.serviceToGroup(id, groupId);

  res.json({ message: "Service erfolgreich der Gruppe zugewiesen" });
});

app.put("/services/:id", async (req, res) => {
  const serviceId = Number(req.params.id);

  const data: NewService = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    iconUrl: req.body.icon_url,
    iconWrap: req.body.icon_wrap,
    enabled: req.body.enabled,
    groupId: req.body.groupId,
  };

  await db.updateService(serviceId, data);

  const updatedTags: string[] = req.body.tags || [];
  const currentTags = await db.allTagsForService(serviceId);

  await Promise.all(
    updatedTags.map((tag) => {
      const foundTag = currentTags.find((t) => t?.name === tag);

      if (foundTag) {
        return;
      }

      return db.tagToService(tag, serviceId);
    })
  );

  await Promise.all(
    currentTags.map((t) => {
      const foundTag = updatedTags.find((tag) => tag === t.name);

      if (foundTag) {
        return;
      }

      return db.removeTagFromService(t.name, serviceId);
    })
  );

  res.json({ message: "Service erfolgreich aktualisiert" });
});

app.post("/services/:id/disable", async (req, res) => {
  const id = Number(req.params.id);

  await db.toggleService(id, false);

  res.json({ message: "Service erfolgreich deaktiviert" });
});

app.post("/services/:id/enable", async (req, res) => {
  const id = Number(req.params.id);

  await db.toggleService(id, true);

  res.json({ message: "Service erfolgreich aktiviert" });
});

app.delete("/services/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.deleteService(id);

  res.json({ message: "Service erfolgreich gelöscht" });
});

app.get("/groups", async (req, res) => {
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

  const services = await getServices();

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

app.post("/groups", async (req, res) => {
  const data = {
    title: req.body.title,
  };

  await db.insertGroup(data);

  res.json({ message: "Gruppe erfolgreich hinzugefügt" });
});

app.put("/groups/:id", async (req, res) => {
  const id = Number(req.params.id);

  const data = {
    title: req.body.title,
  };

  await db.updateGroup(id, data);

  res.json({ message: "Gruppe erfolgreich aktualisiert" });
});

app.delete("/groups/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.deleteGroup(id);
  await db.clearGroup(id);

  res.json({ message: "Gruppe erfolgreich gelöscht" });
});

app.get("/tags", async (req, res) => {
  const data = await db.allTags();

  res.json(data);
});

app.post("/tags", async (req, res) => {
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

app.put("/tags/:id", async (req, res) => {
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

app.post("/tags/:id/toggle/:serviceId", async (req, res) => {
  const tagId = Number(req.params.id);
  const serviceId = Number(req.params.serviceId);

  const { changes } = await db.serviceToggleTag(serviceId, tagId);

  if (changes > 0) {
    res.json({ message: "Tag erfolgreich aktualisiert" });
  } else {
    res.json({ message: "Es ist ein Fehler aufgetreten" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
