import express from "express";
import db from "../db";

const pingRouter = express.Router();

const successResponseCodes = [405, 501];

async function isUrlReachable(url: string) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const response = await fetch(url, { method: "HEAD" });
    console.debug(url, response.status);

    return response.ok || successResponseCodes.includes(response.status);
  } catch (err) {
    return false;
  } finally {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
  }
}

pingRouter.get("/services", async (req, res) => {
  const services = await db.allServices();

  const response = await Promise.all(
    services
      .filter((service) => service.enabled && service.link)
      .map(async (service) => {
        if (!service.link) {
          return;
        }

        return {
          serviceId: service.id,
          isReachable: await isUrlReachable(service.link),
        };
      })
  );

  res.json(response);
});

export default pingRouter;
