import Post from "../models/Post.js";

// ADMIN – get all posts
export const getAllPosts = async (_, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

// PUBLIC – published posts only
export const getPublishedPosts = async (_, res) => {
  const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
  res.json(posts);
};

// ADMIN – create post
export const createPost = async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
};
