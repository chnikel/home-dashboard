import type { TagColors } from "./components/Tag.vue";

export const host = import.meta.env.VITE_FRONTEND_HOST || "";

export type ServiceTag = {
  id: number;
  name: string;
  color: TagColors;
  weight: number
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
};

export const getServices = async () => {
  const response = await fetch(`${host}/services`);

  const services = await response.json();

  return services as GetServicesResponse[];
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
};

export type AddServiceResponse = {};

export const addService = async (data: AddServiceRequest) => {
  const response = await fetch(`${host}/services`, {
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
  const response = await fetch(`${host}/services/${id}`, {
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
    `${host}/services/${serviceId}/group/${groupId}`,
    {
      method: "post",
    }
  );

  const services = await response.json();

  return services as MoveServiceResponse;
};

export type DeleteServiceResponse = {};

export const deleteService = async (id: number) => {
  const response = await fetch(`${host}/services/${id}`, {
    method: "delete",
  });

  const services = await response.json();

  return services as DeleteServiceResponse;
};

export type GetGroupsResponse = {
  id: number;
  title: string;
};

export const getGroups = async () => {
  const response = await fetch(`${host}/groups?services=true`);

  const services = await response.json();

  return services as GetGroupsResponse[];
};

export type GetServiceGroupsResponse = GetGroupsResponse & {
  services: GetServicesResponse[];
};

export const getServiceGroups = async () => {
  const response = await fetch(`${host}/groups?services=true`);

  const services = await response.json();

  return services as GetServiceGroupsResponse[];
};

export type AddGroupRequest = {
  title: string;
};

export type AddGroupResponse = {};

export const addGroup = async (data: AddGroupRequest) => {
  const response = await fetch(`${host}/groups`, {
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

export const updateGroup = async (id: number, data: AddGroupRequest) => {
  const response = await fetch(`${host}/groups/${id}`, {
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

export const deleteGroup = async (id: number) => {
  const response = await fetch(`${host}/groups/${id}`, {
    method: "delete",
  });

  const groups = await response.json();

  return groups as DeleteGroupResponse;
};

export type AddTagRequest = {
  name: string;
  color: string;
  weight: number
};

export type AddTagResponse = {};

export const addTag = async (data: AddTagRequest) => {
  const response = await fetch(`${host}/tags`, {
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
};

export const getTags = async () => {
  const response = await fetch(`${host}/tags`);

  const services = await response.json();

  return services as GetTagsResponse[];
};

export const disableService = async (id: string) => {
   await fetch(`${host}/services/${id}/disable`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: null
  });
};

export const enableService = async (id: string) => {
   await fetch(`${host}/services/${id}/enable`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: null
  });
};
