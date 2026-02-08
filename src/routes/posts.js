import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

/* ------------------- PUBLIC ROUTES ------------------- */

// GET all published posts
router.get("/public", async (req, res) => {
  try {
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post by slug (public)
router.get("/public/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------- ADMIN ROUTES ------------------- */

// GET all posts (admin, including unpublished)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post by ID (admin)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new post
router.post("/", async (req, res) => {
  try {
    const { title, slug, excerpt, content, published } = req.body;
    const post = await Post.create({ title, slug, excerpt, content, published });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// UPDATE post by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, slug, excerpt, content, published } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, slug, excerpt, content, published },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE post by ID
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
