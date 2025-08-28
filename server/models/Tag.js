import { openDB } from "../db.js";

class Tag {
  constructor({ id, name, color }) {
    this.name = name;
    this.color = color;
  }

  load() {
    return new Promise((resolve, reject) => {
      const db = openDB();
      db.get(`SELECT id, color FROM tags WHERE name = '${this.name}'`, (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row);
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      const db = openDB();
      const stmt = db.prepare(
        `
INSERT INTO tags 
(name, color)
VALUES
(
  '${this.name}',
  '${this.color}'
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

  static all() {
    return new Promise((resolve, reject) => {
      const db = openDB();
      db.all("SELECT id, name, color FROM tags", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static async fromName(name) {
    const tag = new Tag({ name });
    const entry = await tag.load();
    tag.id = entry.id
    tag.color = entry.color
    return tag;
  }
}

export default Tag;
