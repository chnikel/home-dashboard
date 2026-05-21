import type { TagColors } from "./components/Tag.vue";

export const host = import.meta.env.VITE_FRONTEND_HOST || "";

export type ServiceTag = {
  id: number;
  name: string;
  color: TagColors;
  weight: number;
};

export type GetServicesResponse = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
  groupId: number;
  tags: ServiceTag[];
  bgColor?: string;
};

export type GetServicesGroupedResponse = {
  [key: string]: GetServicesResponse[];
};

export type AddServiceRequest = {
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
  groupId?: number | null;
  tags: string[];
  bgColor: string;
};

export type AddServiceResponse = {};

export type EditServiceResponse = {};

export type MoveServiceResponse = {};

export type DeleteServiceResponse = {};

export type GetGroupsResponse = {
  id: number;
  title: string;
};

export const getGroups = async () => {
  const response = await fetch(`${host}/api/groups?services=true`);

  const services = await response.json();

  return services as GetGroupsResponse[];
};

export type GetServiceGroupsResponse = GetGroupsResponse & {
  services: GetServicesResponse[];
};

export type AddGroupRequest = {
  title: string;
};

export type AddGroupResponse = {};

export const addGroup = async (data: AddGroupRequest) => {
  const response = await fetch(`${host}/api/groups`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const services = await response.json();

  return services as AddGroupResponse;
};

export type UpdateGroupResponse = {};

export const updateGroup = async (id: string, data: AddGroupRequest) => {
  const response = await fetch(`${host}/api/groups/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const services = await response.json();

  return services as UpdateGroupResponse;
};

export type DeleteGroupResponse = {};

export const deleteGroup = async (id: string) => {
  const response = await fetch(`${host}/api/groups/${id}`, {
    method: "delete",
  });

  const groups = await response.json();

  return groups as DeleteGroupResponse;
};

export type AddTagRequest = {
  name: string;
  color: string;
  weight: number;
};

export type AddTagResponse = {};

export type GetTagsResponse = {
  id: number;
  name: string;
  color: TagColors;
  weight: number;
};
