import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // ❌ remove `required: true`
    slug: { type: String, unique: true },

    excerpt: String,
    content: { type: String, required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug
PostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Auto-generate excerpt
PostSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 120) + "...";
  }
  next();
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
