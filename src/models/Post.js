import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
    image: {
      publicId: String,
      url: String,
      alt: String,
    },
  },
  { timestamps: true }
);


// Auto-generate slug
PostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  if (typeof next === "function") next();
});

// Auto-generate excerpt
PostSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 120) + "...";
  }
  if (typeof next === "function") next();
});

export default mongoose.models.Post ||
  mongoose.model("Post", PostSchema);
