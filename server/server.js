
const express = require("express");
const app = express();
const port = 3000;

const db = require("./db");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/services", (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon.url,
    icon_wrap: req.body.icon.wrap,
    status_enabled: req.body.status.enabled,
    tags: req.body.tags,
  }

  db.insertService(data)

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
