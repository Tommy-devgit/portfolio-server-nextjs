import dotenv from "dotenv";
import mongoose from "mongoose";
import Post from "../models/Post.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    const existing = await Post.countDocuments();
    if (existing > 0) {
      console.log("Database already has posts — skipping seed.");
      process.exit(0);
    }

    const samples = [
      {
        title: "My First Post",
        content: "This is my blog content",
        published: false,
      },
      {
        title: "Hello World",
        content: "Welcome to my blog — seeded post.",
        published: true,
      },
    ];

    const created = await Post.create(samples);
    console.log(`Seeded ${created.length} posts`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

run();
