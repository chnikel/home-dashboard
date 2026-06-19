import {
  host,
  type AddTagRequest,
  type AddTagResponse,
  type GetTagsResponse,
} from "@/api";

const resource = `${host}/api/tags`;

export default {
  get: async () => {
    const response = await fetch(resource);

    const services = await response.json();
    return services as GetTagsResponse[];
  },
  create: async (data: AddTagRequest) => {
    const response = await fetch(resource, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const services = await response.json();
    return services as AddTagResponse;
  },
  toggleVisibility: async (serviceId: string, tagId: string) => {
    await fetch(`${resource}/${tagId}/toggle/${serviceId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });
  },
  delete: async (id: number) => {
    const response = await fetch(`${resource}/${id}`, {
      method: "delete",
    });

    const services = await response.json();

    return services;
  },
};
