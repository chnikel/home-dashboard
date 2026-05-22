import {
  host,
  type AddServiceRequest,
  type AddServiceResponse,
  type DeleteServiceResponse,
  type EditServiceResponse,
  type GetServicesGroupedResponse,
  type GetServicesResponse,
  type MoveServiceResponse,
} from "@/api";

const resource = `${host}/api/services`;

export default {
  getGroupedBy: async (groupBy?: keyof GetServicesResponse) => {
    let query = "";

    if (groupBy) {
      query = new URLSearchParams({
        groupBy,
      }).toString();
    }

    const response = await fetch(`${resource}?${query}`);
    const services = await response.json();

    return services as GetServicesGroupedResponse;
  },
  get: async () => {
    const response = await fetch(resource);
    const services = await response.json();

    return services as GetServicesResponse[];
  },
  getById: async (id: string) => {
    const response = await fetch(`${resource}/${id}`);
    const services = await response.json();

    return services as GetServicesResponse;
  },
  create: async (data: AddServiceRequest) => {
    const response = await fetch(resource, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const services = await response.json();
    return services as AddServiceResponse;
  },
  update: async (id: string, data: AddServiceRequest) => {
    const response = await fetch(`${resource}/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const services = await response.json();
    return services as EditServiceResponse;
  },
  moveToGroup: async (serviceId: string, groupId: string | null) => {
    const response = await fetch(`${resource}/${serviceId}/group/${groupId}`, {
      method: "post",
    });

    const services = await response.json();
    return services as MoveServiceResponse;
  },
  delete: async (id: number) => {
    const response = await fetch(`${resource}/${id}`, {
      method: "delete",
    });

    const services = await response.json();
    return services as DeleteServiceResponse;
  },
  disable: async (id: string) => {
    await fetch(`${resource}/${id}/disable`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });
  },
  enable: async (id: string) => {
    await fetch(`${resource}/${id}/enable`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });
  },
};
