import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  link: text("link"),
  iconUrl: text("icon_url"),
  iconWrap: integer("icon_wrap", { mode: "boolean" }),
  enabled: integer("status_enabled", { mode: "boolean" }),
  groupId: integer("group_id").references(() => groups.id),
});

export type Service = typeof services.$inferInsert;
export type NewService = Omit<Service, "id">;

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
});

export type NewGroup = Omit<typeof groups.$inferInsert, "id">;

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

export type NewTag = Omit<typeof tags.$inferInsert, "id">;

export const serviceTags = sqliteTable("service_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().references(() => services.id),
  tagId: integer("tag_id").notNull().references(() => tags.id),
});

