const Blogs = require("../models/blogSchema");
const Users = require("../models/users");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { GoogleGenerativeAI } = require("@google/generative-ai");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

/* --- PAGINATED HOME --- */
const home = async (req, res) => {
  try {
    // Pagination Params
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Posts per page
    const skip = (page - 1) * limit;

    // Search Logic
    const search = req.query.search || "";
    const query = {
      title: { $regex: search, $options: "i" }, // Case-insensitive search
    };

    const count = await Blogs.countDocuments(query);
    const blogs = await Blogs.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      blogsData: blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, body } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // AI Summary (Safe Mode)
    let aiSummaryText = "";
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Clean HTML tags from body before sending to AI
        const cleanBody = body.replace(/<[^>]+>/g, "");
        const prompt = `Summarize this in 2 sentences: ${cleanBody}`;
        const result = await model.generateContent(prompt);
        aiSummaryText = result.response.text();
      }
    } catch (e) {
      aiSummaryText = body.replace(/<[^>]+>/g, "").substring(0, 100) + "...";
    }

    const newblog = new Blogs({
      title,
      body,
      image: imageUrl,
      aiSummary: aiSummaryText,
      userId: req.session.userid,
    });

    await newblog.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const myBlog = async (req, res) => {
  try {
    const myblogs = await Blogs.find({ userId: req.session.userid });
    res.json({ success: true, blogData: myblogs });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const editBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    const blog = await Blogs.findById(blogId);
    res.json({ success: true, blogData: blog });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    await Blogs.findByIdAndUpdate(blogId, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const deleteBlog = async (req, res) => {
  try {
    await Blogs.findByIdAndDelete(req.query.blogId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const addComment = async (req, res) => {
  try {
    const { blogId, text, username, rating } = req.body;
    const updated = await Blogs.findByIdAndUpdate(
      blogId,
      {
        $push: {
          comments: { text, userId: req.session.userid, username, rating },
        },
      },
      { new: true },
    );

    if (req.app.get("io")) {
      req.app
        .get("io")
        .to(blogId)
        .emit("receive_comment", updated.comments.at(-1));
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.body;
    const blog = await Blogs.findById(blogId);
    blog.comments.pull(commentId);
    await blog.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const updateComment = async (req, res) => {
  try {
    const { blogId, commentId, text, rating } = req.body;
    const blog = await Blogs.findById(blogId);
    const comment = blog.comments.id(commentId);
    comment.text = text;
    comment.rating = rating;
    await blog.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({}, "-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blogs.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

module.exports = {
  home,
  createBlog,
  myBlog,
  editBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
  updateComment,
  getAllUsers,
  getAllBlogsAdmin,
};
