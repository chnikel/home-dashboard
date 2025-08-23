export type GetServicesResponse = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: 1;
  status_enabled: 1;
};

export const getServices = async () => {
  const response = await fetch(
    "http://localhost:3000/services"
  );

  const services = await response.json();

  return services as GetServicesResponse[];
};
