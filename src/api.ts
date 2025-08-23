export type GetServicesResponse = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon_url: string;
  icon_wrap: boolean;
  enabled: boolean;
};

export const getServices = async () => {
  const response = await fetch(
    "http://localhost:3000/services"
  );

  const services = await response.json();

  return services as GetServicesResponse[];
};
