import { openDB } from "../db.js";
import Tag from "./Tag.js";

class Service {
  constructor({
    id,
    title,
    description,
    link,
    icon_url,
    icon_wrap,
    status_enabled,
    groupId,
    tags,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.link = link;
    this.icon_url = icon_url;
    this.icon_wrap = icon_wrap;
    this.status_enabled = status_enabled;
    this.groupId = groupId;
    this.tags = tags || [];
  }

  insert() {
    return new Promise((resolve, reject) => {
      console.log(`[Service::save] Try creating new service`);

      const db = openDB();
      const stmt = db.prepare(
        `
INSERT INTO services 
(title, description, link, icon_url, icon_wrap, status_enabled, group_id)
VALUES
(
  '${this.title}',
  '${this.description}',
  '${this.link}',
  '${this.icon_url}',
  ${this.icon_wrap},
  ${this.status_enabled},
  ${this.groupId || null}
);
`
      );
      stmt.run(function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
      stmt.finalize();

      db.close();
    });
  }

  async save() {
    return new Promise(async (resolve, reject) => {
      const updateExisting = this.id != null;

      if (updateExisting) {
        console.log(
          `[Service::save] Try updating existing service '${this.id}'`
        );
        resolve(null);
      } else {
        resolve(await this.insert());
      }
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

  async getTags() {
    const data = await new Promise((resolve, reject) => {
      const db = openDB();
      db.all(
        `
SELECT t.id, t.name, t.color
FROM tags t
JOIN service_tags st ON t.id = st.tag_id
WHERE st.service_id = ${this.id};
      `,
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });
    
    return data.map((entry) => {
      return new Tag(entry);
    });
  }

  static async all() {
    const data = await new Promise((resolve, reject) => {
      const db = openDB();
      db.all(
        `
SELECT
  id,
  title,
  description,
  link,
  icon_url,
  icon_wrap,
  status_enabled,
  group_id
FROM services
`,
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows);
        }
      );
    });

    return data.map((entry) => {
      return new Service(entry);
    });
  }
}

export default Service;
