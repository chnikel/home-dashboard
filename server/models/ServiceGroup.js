import { openDB } from "../db.js";

class ServiceGroup {
  constructor({ id, title, services }) {
    this.id = id;
    this.title = title;
    this.services = services || [];
  }

  exists() {
    return new Promise((resolve, reject) => {
      const db = openDB();
      db.get(`SELECT id FROM groups WHERE id = '${this.id}'`, (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row != null);
      });
    });
  }

  async save() {
    const updateExisting = this.id != null;

    if (updateExisting) {
      console.log(
        `[ServiceGroup::save] Try updating existing group '${this.id}'`
      );
    } else {
      console.log(`[ServiceGroup::save] Try creating new group`);
    }

    return new Promise(async (resolve, reject) => {
      const db = openDB();
      const stmt = db.prepare(
        updateExisting
          ? `
UPDATE groups
SET 
    title = '${this.title}'
WHERE id = ${this.id};
`
          : `
INSERT INTO groups 
(title)
VALUES
(
  '${this.title}'
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
DELETE FROM groups
WHERE id = ${this.id};
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
      db.all("SELECT id, title FROM groups", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }
}

export default ServiceGroup;
