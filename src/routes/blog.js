import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// GET all published posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
