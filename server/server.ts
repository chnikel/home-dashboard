import express from "express";
import cors from "cors";
import path from "path";

import db from "./db.ts"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../dist")));

const getServices = async () => {
  const data = await db.allServices() as any;

  const services = await Promise.all(
    data.map(async (entry: any) => {
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
    const servicesGrouped = services.reduce((acc: any, service: any) => {
      (acc[service[groupBy as any]] ??= []).push(service);
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

  const serviceId = await db.insertService(data) as string;

  const tags = req.body.tags || [];

  tags.forEach((tag: any) => {
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
  const currentTags = await db.allTagsForService(serviceId) as any;

  updatedTags.forEach((tag: any) => {
    const foundTag = currentTags.find((t: any) => t.name === tag);

    if (foundTag) {
      return;
    }

    db.tagToService(tag, serviceId);
  });

  currentTags.forEach((t: any) => {
    const foundTag = updatedTags.find((tag: any) => tag === t.name);

    if (foundTag) {
      return;
    }

    db.removeTagFromService(t.name, serviceId);
  });

  res.json({ message: "Service erfolgreich aktualisiert" });
});

app.post("/services/:id/disable", (req, res) => {
  const id = req.params.id;

  db.toggleService(id, false);

  res.json({ message: "Service erfolgreich deaktiviert" });
});

app.post("/services/:id/enable", (req, res) => {
  const id = req.params.id;

  db.toggleService(id, true);

  res.json({ message: "Service erfolgreich aktiviert" });
});

app.delete("/services/:id", (req, res) => {
  const id = req.params.id;

  db.deleteService(id);

  res.json({ message: "Service erfolgreich gelöscht" });
});

app.get("/groups", async (req, res) => {
  const includeServices = req.query.services == "true";

  const rawGroups = await db.allGroups() as any;

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

  const servicesGrouped = services.reduce((acc: any, service: any) => {
    (acc[service.groupId] ??= []).push(service);
    return acc;
  }, {});

  const groups = groupsWithDefaultGroup.map((entry) => {
    return {
      id: entry.id,
      title: entry.title,
      services: servicesGrouped[entry.id] || [],
    };
  });

  res.json(groups);
});

app.post("/groups", (req, res) => {
  const data = {
    title: req.body.title,
  };

  db.insertGroup(data);

  res.json({ message: "Gruppe erfolgreich hinzugefügt" });
});

app.put("/groups/:id", (req, res) => {
  const id = req.params.id;

  const data = {
    title: req.body.title,
  };

  db.updateGroup(id, data);

  res.json({ message: "Gruppe erfolgreich aktualisiert" });
});

app.delete("/groups/:id", (req, res) => {
  const id = req.params.id;

  db.deleteGroup(id);
  db.clearGroup(id);

  res.json({ message: "Gruppe erfolgreich gelöscht" });
});

app.get("/tags", async (req, res) => {
  const data = await db.allTags() as any;

  const tags = data.map((entry: any) => ({
    id: entry.id,
    name: entry.name,
    color: entry.color,
  }));

  res.json(tags);
});

app.post("/tags", async (req, res) => {
  const data = {
    name: req.body.name,
    color: req.body.color,
  };

  await db
    .insertTag(data)
    .then(() => {
      res.json({ message: "Tag erfolgreich hinzugefügt" });
    })
    .catch((err: any) => {
      console.log(err);
      res.json({ message: "Es ist ein Fehler aufgetreten" });
    });
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
