import express from "express";
import {
  createPost,
  getAllPosts,
  getPublishedPosts,
  updatePost,
  deletePost,
} from "../controllers/posts.controller.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/public", getPublishedPosts);


export default router;
