import { pool } from "../db/index.js";

// UPDATE
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, published } = req.body;

  const result = await pool.query(
    `UPDATE posts
     SET title=$1, excerpt=$2, content=$3, published=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [title, excerpt, content, published, id]
  );

  res.json(result.rows[0]);
};

// DELETE
export const deletePost = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM posts WHERE id=$1", [id]);
  res.status(204).send();
};

// ADMIN: get all posts
export const getAllPosts = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

// PUBLIC: get published posts
export const getPublishedPosts = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM posts WHERE published=true ORDER BY created_at DESC"
  );
  res.json(result.rows);
};

// ADMIN: create post
export const createPost = async (req, res) => {
  const { title, slug, excerpt, content, published } = req.body;

  const result = await pool.query(
    `INSERT INTO posts (title, slug, excerpt, content, published)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, slug, excerpt, content, published]
  );

  res.status(201).json(result.rows[0]);
};

