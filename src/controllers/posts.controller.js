import { pool } from "../db/index.js";

// UPDATE
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, published } = req.body;

    const result = await pool.query(
      `UPDATE posts
       SET title=$1, excerpt=$2, content=$3, published=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [title, excerpt, content, published, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM posts WHERE id=$1", [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: get all posts
export const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUBLIC: get published posts
export const getPublishedPosts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE published=true ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: create post
export const createPost = async (req, res) => {
  try {
    const { title, slug, excerpt, content, published } = req.body;

    const result = await pool.query(
      `INSERT INTO posts (title, slug, excerpt, content, published)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, slug, excerpt, content, published]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

