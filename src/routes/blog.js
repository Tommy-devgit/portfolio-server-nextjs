import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single blog by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      "SELECT * FROM blogs WHERE slug = $1",
      [slug]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
