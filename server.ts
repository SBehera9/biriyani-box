import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("biriyani.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    category_id INTEGER,
    available INTEGER DEFAULT 1,
    image_url TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);

// Seed data if empty
const catCount = db.prepare("SELECT count(*) as count FROM categories").get() as { count: number };
if (catCount.count === 0) {
  const insertCat = db.prepare("INSERT INTO categories (name) VALUES (?)");
  const chickenId = insertCat.run("Chicken").lastInsertRowid;
  const vegId = insertCat.run("Veg").lastInsertRowid;
  const specialId = insertCat.run("Special Items").lastInsertRowid;
  const addonId = insertCat.run("Add-ons").lastInsertRowid;

  const insertItem = db.prepare("INSERT INTO menu_items (name, price, description, category_id, available, image_url) VALUES (?, ?, ?, ?, ?, ?)");
  
  // Chicken Category (4 items)
  insertItem.run("Classic Chicken Dum Biriyani", 180, "Our signature slow-cooked chicken biriyani with aromatic spices.", chickenId, 1, "https://picsum.photos/seed/c1/600/450");
  insertItem.run("Hyderabadi Chicken Biriyani", 200, "Spicier version with extra masala and long grain basmati rice.", chickenId, 1, "https://picsum.photos/seed/c2/600/450");
  insertItem.run("Boneless Chicken Biriyani", 220, "Tender boneless chicken pieces layered with fragrant rice.", chickenId, 1, "https://picsum.photos/seed/c3/600/450");
  insertItem.run("Chicken Tikka Biriyani", 240, "Smoky chicken tikka pieces cooked in biriyani style.", chickenId, 1, "https://picsum.photos/seed/c4/600/450");

  // Veg Category (4 items)
  insertItem.run("Paneer Dum Biriyani", 160, "Fresh paneer cubes marinated in spices and slow-cooked with rice.", vegId, 1, "https://picsum.photos/seed/v1/600/450");
  insertItem.run("Mixed Veg Biriyani", 140, "Seasonal vegetables cooked with aromatic spices and basmati rice.", vegId, 1, "https://picsum.photos/seed/v2/600/450");
  insertItem.run("Mushroom Biriyani", 170, "Juicy mushrooms layered with fragrant rice and spices.", vegId, 1, "https://picsum.photos/seed/v3/600/450");
  insertItem.run("Soya Chaap Biriyani", 150, "Protein-rich soya chaap cooked in traditional dum style.", vegId, 1, "https://picsum.photos/seed/v4/600/450");

  // Special Items (4 items)
  insertItem.run("Egg Masala Biriyani", 150, "Two boiled eggs served with spicy masala and fragrant rice.", specialId, 1, "https://picsum.photos/seed/s1/600/450");
  insertItem.run("Chicken 65 (Dry)", 120, "Classic spicy deep-fried chicken appetizer.", specialId, 1, "https://picsum.photos/seed/s2/600/450");
  insertItem.run("Chicken Lollipop", 180, "Crispy fried chicken wings served with schezwan sauce.", specialId, 1, "https://picsum.photos/seed/s3/600/450");
  insertItem.run("Mutton Keema Biriyani", 320, "Minced mutton cooked with spices and layered with rice.", specialId, 1, "https://picsum.photos/seed/s4/600/450");

  // Add-ons (4 items)
  insertItem.run("Extra Raita", 20, "Cool yogurt with onions and cucumbers.", addonId, 1, "https://picsum.photos/seed/a1/600/450");
  insertItem.run("Double Ka Meetha", 60, "Traditional bread pudding dessert with nuts.", addonId, 1, "https://picsum.photos/seed/a2/600/450");
  insertItem.run("Gulab Jamun (2pcs)", 40, "Soft milk solids balls dipped in sugar syrup.", addonId, 1, "https://picsum.photos/seed/a3/600/450");
  insertItem.run("Cold Drink (500ml)", 40, "Assorted chilled soft drinks.", addonId, 1, "https://picsum.photos/seed/a4/600/450");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.post("/api/categories", (req, res) => {
    const { name } = req.body;
    try {
      const info = db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
      res.json({ id: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: "Category already exists" });
    }
  });

  app.delete("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/menu", (req, res) => {
    const items = db.prepare(`
      SELECT menu_items.*, categories.name as category_name 
      FROM menu_items 
      LEFT JOIN categories ON menu_items.category_id = categories.id
    `).all();
    res.json(items);
  });

  app.post("/api/menu", (req, res) => {
    const { name, price, description, category_id, available, image_url } = req.body;
    const info = db.prepare("INSERT INTO menu_items (name, price, description, category_id, available, image_url) VALUES (?, ?, ?, ?, ?, ?)")
      .run(name, price, description, category_id, available ? 1 : 0, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/menu/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, description, category_id, available, image_url } = req.body;
    db.prepare("UPDATE menu_items SET name = ?, price = ?, description = ?, category_id = ?, available = ?, image_url = ? WHERE id = ?")
      .run(name, price, description, category_id, available ? 1 : 0, image_url, id);
    res.json({ success: true });
  });

  app.delete("/api/menu/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM menu_items WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
