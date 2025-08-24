const sqlite3 = require("sqlite3").verbose();
const path = require("path")
const fs = require("fs")

const dataFolder = path.join(__dirname, "data")
const dbPath = path.join(dataFolder, "test.db")

if (!fs.existsSync(dataFolder)) {
    console.log("🗂️  Create data folder...");
    fs.mkdirSync(dataFolder);
}

const openDB = () => new sqlite3.Database(dbPath);

const allServices = async () => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    db.all(
      "SELECT id, title, description, link, icon_url, icon_wrap, status_enabled, tags, group_id FROM services",
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
  tags,
  groupId,
}) => {
  const db = openDB();
  const stmt = db.prepare(
    `
INSERT INTO services 
(title, description, link, icon_url, icon_wrap, status_enabled, tags, group_id)
VALUES
(
  '${title}',
  '${description}',
  '${link}',
  '${icon_url}',
  ${icon_wrap},
  ${status_enabled},
  '${tags}',
  ${groupId || null}
);
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const serviceToGroup = (serviceId, groupId) => {
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

const clearGroup = (groupId) => {
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
    tags TEXT,
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

});

const updateService = (
  id,
  {
    title,
    description,
    link,
    icon_url,
    icon_wrap,
    status_enabled,
    tags,
    groupId,
  }
) => {
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
    tags = '',
    group_id = ${groupId}
WHERE id = ${id};
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const deleteService = (id) => {
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

const insertGroup = ({ title }) => {
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

const updateGroup = (id, { title }) => {
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

const deleteGroup = (id) => {
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

const insertTag = ({ name, color }) => {
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
  stmt.run();
  stmt.finalize();

  db.close();
};

module.exports = {
  db,
  insertService,
  allServices,
  updateService,
  deleteService,
  allGroups,
  insertGroup,
  updateGroup,
  deleteGroup,
  clearGroup,
  serviceToGroup,
  insertTag,
};
