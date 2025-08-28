import { openDB } from "../db.js";

class ServiceTag {
  constructor({ name, color }) {
    this.name = name;
    this.color = color;
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
}

export default ServiceTag;
