const sqlite3 = require("sqlite3").verbose();
const openDB = () => new sqlite3.Database("test.db");

const allServices = async () => {
  return new Promise((resolve, reject) => {
    const db = openDB();
    db.all(
      "SELECT id, title, description, link, icon_url, icon_wrap, status_enabled, tags FROM services",
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
    tags TEXT
);
`);
});

db.close();

module.exports = { db, insertService, allServices };
