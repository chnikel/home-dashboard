const sqlite3 = require("sqlite3").verbose();
const openDB = () => new sqlite3.Database("test.db");

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
}) => {
  const db = openDB();
  const stmt = db.prepare(
    `
INSERT INTO services 
(title, description, link, icon_url, icon_wrap, status_enabled, tags)
VALUES
(
  '${title}',
  '${description}',
  '${link}',
  '${icon_url}',
  ${icon_wrap},
  ${status_enabled},
  '${tags}'
);
`
  );
  stmt.run();
  stmt.finalize();

  db.close();
};

const serviceToGroup = (
  serviceId,
  groupId,
) => {
  console.log(`
UPDATE services
SET group_id = ${groupId}
WHERE id = ${serviceId};
`);
  
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
});

const updateService = (
  id,
  { title, description, link, icon_url, icon_wrap, status_enabled, tags }
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
    tags = ''
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
  serviceToGroup
};
