import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/myblog", { credentials: "include" })
      .then((res) => {
        // --- NEW FIX: Handle Unauthorized Access ---
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login"); // Force redirect to login
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setBlogs(data.blogData);
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    const res = await fetch(`http://localhost:3000/deleteblog?blogId=${id}`, {
      credentials: "include",
    });

    if (res.status === 401) {
      alert("Session expired.");
      navigate("/login");
      return;
    }

    if (res.ok) {
      setBlogs(blogs.filter((blog) => blog._id !== id));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Dashboard</h1>
        <Link to="/addblog" className="write-btn">
          Write New Article
        </Link>
      </div>

      <div className="blog-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <div
                className="blog-img-wrapper"
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                <img src={blog.image} alt={blog.title} className="blog-img" />
              </div>

              <div className="blog-content">
                <span className="blog-date">
                  {new Date(blog.createdAt).toDateString()}
                </span>
                <h3
                  className="blog-title"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  {blog.title}
                </h3>

                <div style={{ marginTop: "16px", display: "flex" }}>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/editblog/${blog._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{ textAlign: "center", gridColumn: "1/-1", padding: "40px" }}
          >
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
              You haven't written any blogs yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
