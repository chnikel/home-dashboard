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

export const getServicesGroupBy = async (
  groupBy?: keyof GetServicesResponse
) => {
  let query = "";

  if (groupBy) {
    query = new URLSearchParams({
      groupBy,
    }).toString();
  }

  const response = await fetch(`${host}/api/services?${query}`);

  const services = await response.json();

  return services as GetServicesGroupedResponse;
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

export const addService = async (data: AddServiceRequest) => {
  const response = await fetch(`${host}/api/services`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const services = await response.json();

  return services as AddServiceResponse;
};

export type EditServiceResponse = {};

export const updateService = async (id: string, data: AddServiceRequest) => {
  const response = await fetch(`${host}/api/services/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const services = await response.json();

  return services as EditServiceResponse;
};

export type MoveServiceResponse = {};

export const moveService = async (
  serviceId: string,
  groupId: string | null
) => {
  const response = await fetch(
    `${host}/api/services/${serviceId}/group/${groupId}`,
    {
      method: "post",
    }
  );

  const services = await response.json();

  return services as MoveServiceResponse;
};

export type DeleteServiceResponse = {};

export const deleteService = async (id: number) => {
  const response = await fetch(`${host}/api/services/${id}`, {
    method: "delete",
  });

  const services = await response.json();

  return services as DeleteServiceResponse;
};

export type GetGroupsResponse = {
  id: number;
  title: string;
  colspan: number;
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
  colspan: number;
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

export const addTag = async (data: AddTagRequest) => {
  const response = await fetch(`${host}/api/tags`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const services = await response.json();

  return services as AddTagResponse;
};

export type GetTagsResponse = {
  id: number;
  name: string;
  color: TagColors;
  weight: number;
};

export const getTags = async () => {
  const response = await fetch(`${host}/api/tags`);

  const services = await response.json();

  return services as GetTagsResponse[];
};

export const disableService = async (id: string) => {
  await fetch(`${host}/api/services/${id}/disable`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  });
};

export const enableService = async (id: string) => {
  await fetch(`${host}/api/services/${id}/enable`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  });
};

export const toggleTag = async (serviceId: string, tagId: string) => {
  await fetch(`${host}/api/tags/${tagId}/toggle/${serviceId}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  });
};
