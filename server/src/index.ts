import express from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";

import db from "./db";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../../dist")));

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

  const serviceId = await db.insertService(data);

  const tags = req.body.tags || [];

  await Promise.all(
    tags.map((tag: any) => {
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

  await Promise.all(
    updatedTags.map((tag: any) => {
      const foundTag = currentTags.find((t) => t.tags?.name === tag);

      if (foundTag) {
        return;
      }

      return db.tagToService(tag, serviceId);
    })
  );

  await Promise.all(
    currentTags.map((t: any) => {
      const foundTag = updatedTags.find((tag: any) => tag === t.name);

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

  const servicesGrouped = services.reduce((acc: any, service: any) => {
    (acc[service.groupId] ??= []).push(service);
    return acc;
  }, {});

  const groups = groupsWithDefaultGroup.map((entry) => {
    return {
      id: entry.id,
      title: entry.title,
      services: entry.id ? servicesGrouped[entry.id] || [] : [],
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

  const tags = data.map((entry) => ({
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
