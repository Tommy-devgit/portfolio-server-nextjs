import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

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
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const published = req.body.published === "true" || req.body.published === true;
    const postData = {
      title: req.body.title,
      slug: req.body.slug,
      excerpt: req.body.excerpt,
      content: req.body.content,
      published,
    };

    if (req.file) {
      postData.image = {
        publicId: req.file.filename,
        url: req.file.path,
      };
    }

    const post = new Post(postData);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// UPDATE post by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const { title, slug, excerpt, content } = req.body;
    const published = req.body.published === "true" || req.body.published === true;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // If an image was uploaded, replace the existing one
    const updateData = { title, slug, excerpt, content, published };
    if (req.file) {
      const existing = await Post.findById(id);
      if (existing && existing.image && existing.image.publicId) {
        try {
          await cloudinary.uploader.destroy(existing.image.publicId);
        } catch (destroyErr) {
          console.error("Failed to delete old image from Cloudinary:", destroyErr);
        }
      }
      updateData.image = { publicId: req.file.filename, url: req.file.path };
    }

    const post = await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate field value", details: err.keyValue });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE post by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // remove image from Cloudinary if present
    if (post.image && post.image.publicId) {
      try {
        await cloudinary.uploader.destroy(post.image.publicId);
      } catch (destroyErr) {
        console.error("Failed to delete image from Cloudinary:", destroyErr);
      }
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
