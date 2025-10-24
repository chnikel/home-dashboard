import http from "http";
import https from "https";
import fs from "fs";
import path from "path";

const BYTE_IN_MB = 1048576;

export class FileDownloader {
  constructor(public folder: string) {}

  download(filename: string, url: string) {
    if (!fs.existsSync(this.folder)) {
      console.log("🗂️  Create images folder...");
      fs.mkdirSync(this.folder);
    }

    return new Promise((resolve, reject) => {
      let localFile = fs.createWriteStream(path.join(this.folder, filename));

      const client = url.startsWith("https") ? https : http;
      const request = client.get(url, (response) => {
        const contentLength = response.headers["content-length"];
        if (!contentLength) {
          reject("Missing header: content-length");
          return;
        }

        var len = parseInt(contentLength, 10);
        var cur = 0;
        var total = len / BYTE_IN_MB;

        response.on("data", (chunk) => {
          cur += chunk.length;
          // this.showProgress(filename, cur, len, total);
        });

        response.on("end", () => {
          // console.log("Download complete");
          resolve(localFile);
        });

        response.pipe(localFile);
      });

      resolve(request);
    });
  }

  showProgress(
    filename: string,
    current: number,
    length: number,
    total: number
  ) {
    console.log(
      "Downloading " +
        filename +
        " - " +
        ((100.0 * current) / length).toFixed(2) +
        "% (" +
        (current / 1048576).toFixed(2) +
        " MB) of total size: " +
        total.toFixed(2) +
        " MB"
    );
  }
}
