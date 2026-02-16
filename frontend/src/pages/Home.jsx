import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true); // Start shimmering
    try {
      const res = await fetch(
        `${API_URL}/?page=${page}&search=${search}`,
      );
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogsData);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log("Error fetching blogs");
    } finally {
      // Add a tiny artificial delay so users can actually SEE the smooth skeleton
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [page, search]);

  return (
    <div className="container">
      <div className="home-controls">
        <h2 style={{ fontWeight: "800", fontSize: "1.8rem" }}>
          Latest Articles
        </h2>
        <input
          type="text"
          placeholder="🔍 Search articles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
      </div>

      <div className="blog-grid">
        {/* --- SKELETON LOADER LOGIC --- */}
        {loading ? (
          // Show 6 fake skeleton cards while loading
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="blog-card"
              style={{ pointerEvents: "none" }}
            >
              <div className="skeleton skeleton-img"></div>
              <div className="blog-content">
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "30%" }}
                ></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div
                  className="skeleton skeleton-text"
                  style={{ width: "80%" }}
                ></div>
                <div className="skeleton skeleton-btn"></div>
              </div>
            </div>
          ))
        ) : // Show Actual Data
        blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-card"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              <div className="blog-img-wrapper">
                <img src={blog.image} alt={blog.title} className="blog-img" />
              </div>
              <div className="blog-content">
                <span className="blog-date">
                  {new Date(blog.createdAt).toDateString()}
                </span>
                <h3 className="blog-title">{blog.title}</h3>
                <p
                  className="blog-preview"
                  style={{ color: "#64748b", fontSize: "0.95rem" }}
                >
                  {blog.body.replace(/<[^>]+>/g, "").substring(0, 100)}...
                </p>
                <span className="read-more">Read Article →</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", color: "#64748b" }}>
            No articles found.
          </p>
        )}
      </div>

      {!loading && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn-page"
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="btn-page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
