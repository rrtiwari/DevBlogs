const express = require("express");
const router = express.Router();
const multer = require("multer");

// --- 1. SETUP MULTER (Memory Storage for Cloudinary) ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
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
} = require("./controllers/blogController");

const {
  registerUser,
  login,
  logout,
  checkSession,
} = require("./controllers/userController");

const requireAuth = (req, res, next) => {
  if (req.session.userid) return next();
  res.status(401).json({ success: false, message: "Unauthorized" });
};

// --- ROUTES ---

// Auth
router.get("/", home);
router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-session", checkSession);

// Blogs
// CRITICAL FIX: Added 'upload.single("image")' here 
router.post("/createblog", requireAuth, upload.single("image"), createBlog);

router.get("/myblog", requireAuth, myBlog);
router.get("/editblog", editBlog);
router.post("/updateblog", requireAuth, updateBlog);
router.get("/deleteblog", requireAuth, deleteBlog);

// Comments
router.post("/addcomment", requireAuth, addComment);
router.post("/deletecomment", requireAuth, deleteComment);
router.post("/updatecomment", requireAuth, updateComment);

// Admin
router.get("/admin/users", getAllUsers);
router.get("/admin/blogs", getAllBlogsAdmin);

module.exports = { router };
