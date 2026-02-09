import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import postsRouter from "./routes/posts.js";


dotenv.config();

const app = express();

/* ✅ CORS — must be BEFORE routes */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Healthcheck
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API running" });
});

// Routes
app.use("/api/posts", postsRouter);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
