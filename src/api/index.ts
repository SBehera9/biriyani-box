import express from "express";
import path from "path";
import { categories, menuItems } from "../data/menuData.js";

const app = express();

app.use(express.json());

// API Routes
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "static-data" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
}

export default app;