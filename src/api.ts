export type GetServicesResponse = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
  groupId: number
};

export const getServices = async () => {
  const response = await fetch("http://localhost:3000/services");

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
};

export type AddServiceResponse = {};

export const addService = async (data: AddServiceRequest) => {
  const response = await fetch("http://localhost:3000/services", {
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

export const updateService = async (id: number, data: AddServiceRequest) => {
  const response = await fetch(`http://localhost:3000/services/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const services = await response.json();

  return services as EditServiceResponse;
};

export type DeleteServiceResponse = {};

export const deleteService = async (id: number) => {
  const response = await fetch(`http://localhost:3000/services/${id}`, {
    method: "delete",
  });

  const services = await response.json();

  return services as DeleteServiceResponse;
};

export type GetServiceGroupsResponse = {
  id: number;
  title: string;
  services: GetServicesResponse[]
};

export const getServiceGroups = async () => {
  const response = await fetch("http://localhost:3000/groups?services=true");

  const services = await response.json();

  return services as GetServiceGroupsResponse[];
};
