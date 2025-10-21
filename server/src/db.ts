import _sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const sqlite3 = _sqlite3.verbose();

const dataFolder = path.join(__dirname, "data");
const dbPath = path.join(dataFolder, "test.db");

if (!fs.existsSync(dataFolder)) {
  console.log("🗂️  Create data folder...");
  fs.mkdirSync(dataFolder);
}

const openDB = () => new sqlite3.Database(dbPath);

const allServices = async () => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    db.all(
      "SELECT id, title, description, link, icon_url, icon_wrap, status_enabled, group_id FROM services",
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
};

const insertService = ({
  title,
  description,
  link,
  icon_url,
  icon_wrap,
  status_enabled,
  groupId,
}: any) => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    const stmt = db.prepare(
      `
INSERT INTO services 
(title, description, link, icon_url, icon_wrap, status_enabled, group_id)
VALUES
(
  '${title}',
  '${description}',
  '${link}',
  '${icon_url}',
  ${icon_wrap},
  ${status_enabled},
  ${groupId || null}
);
`
    );
    stmt.run(function (err) {
      if (err) {
        reject(err);
        return;
      }
      // @ts-ignore
      resolve(this.lastID);
    });
    stmt.finalize();

    db.close();
  });
};

const serviceToGroup = (serviceId: string, groupId: string) => {
  const db = openDB();
  const stmt = db.prepare(
    `
UPDATE services
SET group_id = ${groupId}
WHERE id = ${serviceId};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const clearGroup = (groupId: string) => {
  const db = openDB();
  const stmt = db.prepare(
    `
UPDATE services
SET group_id = null
WHERE group_id = ${groupId};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const db = openDB();
db.serialize(() => {
  console.log("🗂️  Create DB if not exists...");

  db.run(`
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link TEXT,
    icon_url TEXT,
    icon_wrap BOOLEAN,
    status_enabled BOOLEAN,
    group_id INT
);
`);

  db.run(`
CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL
);
`);

  db.run(`
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL
);
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS service_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL
);
`);
});

const updateService = (
  id: string,
  { title, description, link, icon_url, icon_wrap, status_enabled, groupId }: any
) => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    const stmt = db.prepare(
      `
UPDATE services
SET 
    title = '${title}',
    description = '${description}',
    link = '${link}',
    icon_url = '${icon_url}',
    icon_wrap = ${icon_wrap},
    status_enabled = ${status_enabled},
    group_id = ${groupId}
WHERE id = ${id};
`
    );
    stmt.run(function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
    stmt.finalize();

    db.close();
  });
};

const toggleService = (id: string, enabled: boolean) => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    const stmt = db.prepare(
      `
UPDATE services
SET 
    status_enabled = ${enabled}
WHERE id = ${id};
`
    );
    stmt.run(function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
    stmt.finalize();

    db.close();
  });
};

const deleteService = (id: string) => {
  const db = openDB();
  const stmt = db.prepare(
    `
DELETE FROM services
WHERE id = ${id};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

db.close();

const allGroups = async () => {
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
};

const insertGroup = ({ title }: any) => {
  const db = openDB();
  const stmt = db.prepare(
    `
INSERT INTO groups 
(title)
VALUES
(
  '${title}'
);
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const updateGroup = (id: string, { title }: any) => {
  const db = openDB();
  const stmt = db.prepare(
    `
UPDATE groups
SET 
    title = '${title}'
WHERE id = ${id};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const deleteGroup = (id: string) => {
  const db = openDB();
  const stmt = db.prepare(
    `
DELETE FROM groups
WHERE id = ${id};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const allTags = () => {
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
};

const insertTag = ({ name, color }: any) => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    const stmt = db.prepare(
      `
INSERT INTO tags 
(name, color)
VALUES
(
  '${name}',
  '${color}'
);
`
    );
    stmt.run(function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
    stmt.finalize();

    db.close();
  });
};

const allTagsForService = (serviceId: string) => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    db.all(
      `
SELECT t.id, t.name, t.color
FROM tags t
JOIN service_tags st ON t.id = st.tag_id
WHERE st.service_id = ${serviceId};
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
};

const tagToService = (tag: string, serviceId: string) => {
  const db = openDB();
  const stmt = db.prepare(
    `
INSERT INTO service_tags (service_id, tag_id)
VALUES 
(
  ${serviceId},
  (SELECT id FROM tags WHERE name='${tag}')
);
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const removeTagFromService = (tag: string, serviceId: string) => {
  const db = openDB();
  const stmt = db.prepare(
    `
DELETE FROM service_tags
WHERE tag_id = (SELECT id FROM tags WHERE name = '${tag}')
AND service_id = ${serviceId};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

export default {
  db,
  insertService,
  allServices,
  updateService,
  toggleService,
  deleteService,
  allGroups,
  insertGroup,
  updateGroup,
  deleteGroup,
  clearGroup,
  serviceToGroup,
  allTags,
  insertTag,
  allTagsForService,
  tagToService,
  removeTagFromService,
};
