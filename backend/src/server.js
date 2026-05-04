import express from "express";
import cors from "cors";
import morgan from "morgan";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/store.json");
const PORT = process.env.PORT || 4000;

const app = express();
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"].filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS blocked: origin not allowed"));
  }
}));
app.use(express.json());
app.use(morgan("dev"));

async function readDb() {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(db) {
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2));
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

app.get("/", (_, res) => {
  res.json({
    service: "apexmoto-backend",
    message: "Backend is running",
    docs: "/health and /api/{products|shops|bikes}"
  });
});

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "apexmoto-backend" });
});

for (const resource of ["products", "shops", "bikes"]) {
  app.get(`/api/${resource}`, async (_, res) => {
    const db = await readDb();
    res.json(db[resource]);
  });

  app.get(`/api/${resource}/:id`, async (req, res) => {
    const db = await readDb();
    const item = db[resource].find((r) => r.id === req.params.id);
    if (!item) return res.status(404).json({ error: `${resource.slice(0, -1)} not found` });
    res.json(item);
  });

  app.post(`/api/${resource}`, async (req, res) => {
    const db = await readDb();
    const item = { id: req.body.id || newId(resource.slice(0, -1)), ...req.body };
    db[resource].push(item);
    await writeDb(db);
    res.status(201).json(item);
  });

  app.put(`/api/${resource}/:id`, async (req, res) => {
    const db = await readDb();
    const idx = db[resource].findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: `${resource.slice(0, -1)} not found` });
    db[resource][idx] = { ...db[resource][idx], ...req.body, id: req.params.id };
    await writeDb(db);
    res.json(db[resource][idx]);
  });

  app.delete(`/api/${resource}/:id`, async (req, res) => {
    const db = await readDb();
    const initialLength = db[resource].length;
    db[resource] = db[resource].filter((r) => r.id !== req.params.id);
    if (db[resource].length === initialLength) {
      return res.status(404).json({ error: `${resource.slice(0, -1)} not found` });
    }
    await writeDb(db);
    res.status(204).send();
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`ApexMoto backend running on http://localhost:${PORT}`);
});
