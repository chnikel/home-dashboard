import { and, eq } from "drizzle-orm";
import { db } from "./db/index";
import {
  groups,
  NewGroup,
  NewService,
  NewTag,
  services,
  serviceTags,
  tags,
} from "./db/schema";

const allServices = async () => {
  return db.select().from(services);
};

const insertService = (data: NewService) => {
  if (data.groupId == -1) {
    data.groupId = null;
  }

  const result = db.insert(services).values(data);
  return result;
};

const serviceToGroup = async (serviceId: number, groupId: number | null) => {
  if (groupId == -1) {
    groupId = null;
  }

  const result = await db
    .update(services)
    .set({
      groupId: groupId,
    })
    .where(eq(services.id, serviceId));

  return result;
};

const clearGroup = async (groupId: number) => {
  const result = await db
    .update(services)
    .set({
      groupId: groupId,
    })
    .where(eq(services.groupId, groupId));

  return result;
};

const updateService = async (serviceId: number, data: NewService) => {
  if (data.groupId == -1) {
    data.groupId = null;
  }

  const result = await db
    .update(services)
    .set(data)
    .where(eq(services.id, serviceId));

  return result;
};

const serviceToggleTag = async (serviceId: number, tagId: number) => {
  const hasTagResult = await serviceHasTag(serviceId, tagId);

  if (hasTagResult) {
    return removeTagFromServiceById(tagId, serviceId);
  }

  return tagToServiceById(tagId, serviceId);
};

const toggleService = async (serviceId: number, isEnabled: boolean) => {
  const result = await db
    .update(services)
    .set({
      enabled: isEnabled,
    })
    .where(eq(services.id, serviceId));

  return result;
};

const deleteService = (serviceId: number) => {
  const result = db.delete(services).where(eq(services.id, serviceId));
  return result;
};

const allGroups = async () => {
  const result = db.select().from(groups);
  return result;
};

const insertGroup = async (data: NewGroup) => {
  const result = db.insert(groups).values(data);
  return result;
};

const updateGroup = async (groupId: number, data: NewGroup) => {
  const result = db.update(groups).set(data).where(eq(groups.id, groupId));
  return result;
};

const deleteGroup = (groupId: number) => {
  const result = db.delete(groups).where(eq(groups.id, groupId));
  return result;
};

const allTags = () => {
  const result = db.select().from(tags);
  return result;
};

const findTagByName = async (name: string) => {
  const result = await db.select().from(tags).where(eq(tags.name, name));

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

const getTagById = (tagId: number) => {
  const result = db.select().from(tags).where(eq(tags.id, tagId));
  return result;
};

const insertTag = (data: NewTag) => {
  const result = db.insert(tags).values(data);
  return result;
};

const updateTag = (tagId: number, data: Partial<NewTag>) => {
  const result = db.update(tags).set(data).where(eq(tags.id, tagId));
  return result;
};

const allTagsForService = async (serviceId: number) => {
  const result = db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
      weight: tags.weight,
    })
    .from(tags)
    .leftJoin(serviceTags, eq(tags.id, serviceTags.tagId))
    .where(eq(serviceTags.serviceId, serviceId));

  return result;
};

const serviceHasTag = async (serviceId: number, tagId: number) => {
  const result = await db
    .select()
    .from(serviceTags)
    .where(
      and(eq(serviceTags.serviceId, serviceId), eq(serviceTags.tagId, tagId))
    );

  return result.length > 0;
};

const tagToService = async (tagName: string, serviceId: number) => {
  const tag = await findTagByName(tagName);

  if (!tag) {
    console.warn(`Not adding tag '${tagName}'. Reason: Tag not found.`);
    return;
  }

  return tagToServiceById(tag.id, serviceId);
};

const tagToServiceById = async (tagId: number, serviceId: number) => {
  const result = db.insert(serviceTags).values({
    serviceId: serviceId,
    tagId: tagId,
  });

  return result;
};

const removeTagFromService = async (tagName: string, serviceId: number) => {
  const tag = await findTagByName(tagName);

  if (!tag) {
    throw Error(`Tag not found '${tagName}'`);
  }

  return removeTagFromServiceById(tag.id, serviceId);
};

const removeTagFromServiceById = async (tagId: number, serviceId: number) => {
  const result = db
    .delete(serviceTags)
    .where(
      and(eq(serviceTags.tagId, tagId), eq(serviceTags.serviceId, serviceId))
    );

  return result;
};

export default {
  db,
  insertService,
  allServices,
  updateService,
  serviceToggleTag,
  toggleService,
  deleteService,
  allGroups,
  insertGroup,
  updateGroup,
  deleteGroup,
  clearGroup,
  serviceToGroup,
  allTags,
  getTagById,
  insertTag,
  updateTag,
  allTagsForService,
  tagToService,
  removeTagFromService,
};
