const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const db = require("./db");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/services", async (req, res) => {
  const data = await db.allServices();

  const services = data.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    link: entry.link,
    icon_url: entry.icon_url,
    icon_wrap: entry.icon_wrap ? true : false,
    enabled: entry.status_enabled ? true : false,
  }));

  res.json(services);
});

app.post("/services", (req, res) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon_url,
    icon_wrap: req.body.icon_wrap,
    status_enabled: req.body.enabled,
    tags: [],
  };

  db.insertService(data);

  res.json({ message: "Service erfolgreich hinzugefügt" });
});

app.put("/services/:id", (req, res) => {
  const id = req.params.id

  const data = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    icon_url: req.body.icon_url,
    icon_wrap: req.body.icon_wrap,
    status_enabled: req.body.enabled,
    tags: [],
  };

  db.updateService(id, data);

  res.json({ message: "Service erfolgreich aktualisiert" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
