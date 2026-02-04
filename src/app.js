import express from "express";
import cors from "cors";
import postsRoutes from "./routes/posts.js";
import blogRoutes from "./routes/blog.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", postsRoutes);
app.use("/api/blog", blogRoutes);

export default app;
