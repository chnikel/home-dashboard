import {
  host,
  type AddGroupRequest,
  type AddGroupResponse,
  type DeleteGroupResponse,
  type GetGroupsResponse,
  type UpdateGroupResponse,
} from "@/api";

const resource = `${host}/api/groups`;

export default {
  get: async () => {
    const response = await fetch(`${resource}?services=true`);

    const services = await response.json();
    return services as GetGroupsResponse[];
  },
  create: async (data: AddGroupRequest) => {
    const response = await fetch(resource, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const services = await response.json();
    return services as AddGroupResponse;
  },
  update: async (id: string, data: AddGroupRequest) => {
    const response = await fetch(`${resource}/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const services = await response.json();

    return services as UpdateGroupResponse;
  },
  delete: async (id: string) => {
    const response = await fetch(`${resource}/${id}`, {
      method: "delete",
    });

    const groups = await response.json();
    return groups as DeleteGroupResponse;
  },
};
