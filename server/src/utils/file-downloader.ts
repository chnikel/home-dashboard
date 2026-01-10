import https from "https";
import fs from "fs";

export const downloadFile = (url: string, destination: string) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            resolve(undefined);
          });
        });
      })
      .on("error", (err) => {
        fs.unlink(destination, () => {
          reject(err);
        });
      });
  });
};
