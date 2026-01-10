import fs from "fs";
import express from "express";
import { downloadFile } from "../utils/file-downloader";
import config from "../config";
import path from "path";
import db from "../db";

const imageRouter = express.Router();

const downloadServiceIcon = async (fullUrl: string, storeFilename: string) => {
  const url = new URL(fullUrl);

  const filename = url.pathname.split("/").pop();

  if (!filename) {
    throw new Error(`Invalid filename`);
  }

  const fileExtension = filename.split(".").pop();

  if (!fileExtension) {
    throw new Error(`Invalid file extension`);
  }

  const imagesDir = path.join(config.publicDir, "images");

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  return downloadFile(
    fullUrl,
    path.join(imagesDir, `${storeFilename}.${fileExtension}`)
  );
};

imageRouter.post("/url-to-image", async (req, res) => {
  const services = await db.allServices();

  await Promise.allSettled(
    services.map((service, i) => {
      if (!service.iconUrl || i > 20) {
        return;
      }

      downloadServiceIcon(service.iconUrl, `${service.id}`);
    })
  );

  res.json({});
});

export default imageRouter;
