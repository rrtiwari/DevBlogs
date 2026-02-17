# 🚀 DevBlog - AI-Powered MERN Blogging Platform

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)
![AI Powered](https://img.shields.io/badge/AI-Gemini%20Integrated-purple)
![Responsive](https://img.shields.io/badge/Design-Responsive-green)

A professional, full-stack blogging application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features real-time updates, secure authentication, image uploads, and **AI-powered content summarization** using Google Gemini.

---

## ✨ Key Features

### 🤖 AI Integration
* **Auto-Summarization:** Automatically generates concise 2-sentence summaries for every blog post using **Google Gemini AI**.

### 📝 Content Management
* **Rich Text Editor:** Integrated **React-Quill** for formatting articles (Bold, Italic, Lists, Links).
* **Image Uploads:** Seamless image hosting using **Cloudinary**.
* **Search & Pagination:** Efficiently handles large datasets with server-side pagination and real-time search.

### 🔐 Security & Authentication
* **Role-Based Access Control (RBAC):**
    * **Admins:** Can manage all users, posts, and delete any comment.
    * **Users:** Can create posts and manage their own comments.
* **Secure Auth:** Session-based authentication with `httpOnly` cookies and `bcrypt` password hashing.
* **Validation:** Robust backend validation using **Joi**.

### 🎨 UI/UX
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
* **Skeleton Loaders:** Smooth loading states for a premium user experience.
* **Real-time Notifications:** Toast notifications for actions (Login, Publish, Error).

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* React Router DOM
* React Quill (Rich Text Editor)
* React Hot Toast
* CSS3 (Custom Responsive Design)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* Socket.io (Real-time updates)
* Cloudinary (Image Storage)
* Google Gemini API (AI)
* Multer (File Handling)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/rr_tiwari/DevBlogs.git](https://github.com/rr_tiwari/DevBlogs.git)
cd DevBlogs
