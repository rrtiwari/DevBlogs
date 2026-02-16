const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commentSchema = new schema(
  {
    text: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    username: String,
    rating: { type: Number, default: 0, min: 1, max: 5 },
  },
  { timestamps: true },
);

const blogSchema = new schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, default: "" },
    aiSummary: { type: String, default: "" },
    userId: { type: String, required: true },
    comments: [commentSchema],
  },
  { timestamps: true },
);

const Blogs = mongoose.model("Blogs", blogSchema);
module.exports = Blogs;
