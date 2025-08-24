const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

const db = require("./db");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/services", async (req, res) => {
  const data = await db.allServices();

  const services = data.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    link: entry.link,
    icon_url: entry.icon_url,
    icon_wrap: entry.icon_wrap ? true : false,
    enabled: entry.status_enabled ? true : false,
    groupId: entry.group_id,
  }));

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

app.post("/services", (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon_url,
    icon_wrap: req.body.icon_wrap,
    status_enabled: req.body.enabled,
    tags: [],
    groupId: req.body.groupId,
  };

  db.insertService(data);

  res.json({ message: "Service erfolgreich hinzugefügt" });
});

app.post("/services/:id/group/:group", (req, res) => {
  const id = req.params.id;
  const groupId = req.params.group;

  db.serviceToGroup(id, groupId);

  res.json({ message: "Service erfolgreich der Gruppe zugewiesen" });
});

app.put("/services/:id", (req, res) => {
  const id = req.params.id;

  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon_url,
    icon_wrap: req.body.icon_wrap,
    status_enabled: req.body.enabled,
    tags: [],
    groupId: req.body.groupId,
  };

  db.updateService(id, data);

  res.json({ message: "Service erfolgreich aktualisiert" });
});

app.delete("/services/:id", (req, res) => {
  const id = req.params.id;

  db.deleteService(id);

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

  const rawServices = await db.allServices();
  const services = rawServices.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    link: entry.link,
    icon_url: entry.icon_url,
    icon_wrap: entry.icon_wrap ? true : false,
    enabled: entry.status_enabled ? true : false,
    groupId: entry.group_id,
  }));

  const servicesGrouped = services.reduce((acc, service) => {
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
