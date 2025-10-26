import express from "express";
import db from "../db";
import { NewService } from "../db/schema";

const serviceRouter = express.Router();

export const NEED_REFACTOR_getServices = async () => {
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

serviceRouter.get("", async (req, res) => {
  const services = await NEED_REFACTOR_getServices();

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

serviceRouter.post("", async (req, res) => {
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

serviceRouter.post("/:id/group/:group", async (req, res) => {
  const id = Number(req.params.id);
  const groupId = Number(req.params.group);

  await db.serviceToGroup(id, groupId);

  res.json({ message: "Service erfolgreich der Gruppe zugewiesen" });
});

serviceRouter.put("/:id", async (req, res) => {
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

serviceRouter.post("/:id/disable", async (req, res) => {
  const id = Number(req.params.id);

  await db.toggleService(id, false);

  res.json({ message: "Service erfolgreich deaktiviert" });
});

serviceRouter.post("/:id/enable", async (req, res) => {
  const id = Number(req.params.id);

  await db.toggleService(id, true);

  res.json({ message: "Service erfolgreich aktiviert" });
});

serviceRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  await db.deleteService(id);

  res.json({ message: "Service erfolgreich gelöscht" });
});

export default serviceRouter;
