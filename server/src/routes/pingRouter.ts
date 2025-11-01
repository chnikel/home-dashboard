import express from "express";
import db from "../db";

const pingRouter = express.Router();

async function isUrlReachable(url: string) {
  try {
    const response = await fetch(url, { method: "GET" });
    console.log(url, response.ok);
    
    return response.ok;
  } catch (err) {
    return false;
  }
}

pingRouter.get("/services", async (req, res) => {
  const services = await db.allServices();

  const response = await Promise.all(services
    .filter((service) => service.enabled && service.link)
    .map(async (service) => {
      if (!service.link) {
        return;
      }

      return {
        serviceId: service.id,
        isReachable: await isUrlReachable(service.link)
      };
    }));

  res.json(response);
});

export default pingRouter;
