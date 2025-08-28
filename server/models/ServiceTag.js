import { openDB } from "../db.js";

class ServiceTag {
  constructor({ serviceId, tag }) {
    this.serviceId = serviceId;
    this.tag = tag;
  }

  save() {
    return new Promise((resolve, reject) => {
      const db = openDB();
      const stmt = db.prepare(
        `
INSERT INTO service_tags (service_id, tag_id)
VALUES 
(
  ${this.serviceId},
  (SELECT id FROM tags WHERE name='${this.tag.name}')
);
`
      );
      stmt.run(function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
      stmt.finalize();

      db.close();
    });
  }

  async delete() {
    return new Promise(async (resolve, reject) => {
      const db = openDB();
      const stmt = db.prepare(
        `
DELETE FROM service_tags
WHERE tag_id = (SELECT id FROM tags WHERE name = '${this.tag.name}')
AND service_id = ${this.serviceId};
`
      );
      stmt.run(function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
      stmt.finalize();

      db.close();
    });
  }
}

export default ServiceTag;
