import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", body: "" });

  useEffect(() => {
  
    fetch(`${API_URL}/editblog?blogId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlog({ title: data.blogData.title, body: data.blogData.body });
        }
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/updateblog?blogId=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      navigate("/myblog"); 
    } else {
      alert("Failed to update blog");
    }
  };

  return (
    <div className="editor-container">
      <h1
        className="editor-title"
        style={{ fontSize: "1.5rem", marginBottom: "20px" }}
      >
        ✏️ Edit Article
      </h1>
      <form onSubmit={handleUpdate} className="editor-form">
        <label style={{ fontWeight: "bold", color: "#64748b" }}>Title</label>
        <input
          type="text"
          className="editor-input"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          required
          style={{
            fontSize: "1.5rem",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        />

        <label
          style={{ fontWeight: "bold", color: "#64748b", marginTop: "20px" }}
        >
          Content
        </label>
        <textarea
          className="editor-textarea"
          value={blog.body}
          onChange={(e) => setBlog({ ...blog, body: e.target.value })}
          required
          style={{
            minHeight: "300px",
            border: "1px solid #e2e8f0",
            padding: "15px",
            borderRadius: "12px",
          }}
        />

        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
          <button type="submit" className="btn-publish">
            Save Changes
          </button>
          <button
            type="button"
            className="btn-delete"
            style={{ background: "#f1f5f9", color: "#333" }}
            onClick={() => navigate("/myblog")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
