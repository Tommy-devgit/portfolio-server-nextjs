import express from "express";
import cors from "cors";
import postsRoutes from "./routes/posts.js";
import blogRoutes from "./routes/blog.js";

const app = express();

app.use(cors());
app.use(express.json());

// Root route for healthcheck / browser GET /
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio server API is running' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/posts", postsRoutes);
app.use("/api/blog", blogRoutes);

export default app;
