import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const BlogDetails = ({ user }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/editblog?blogId=${id}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.blogData);
          setCommentsList(data.blogData.comments || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlog();
    socket.emit("join_blog", id);
    socket.on("receive_comment", (newComment) =>
      setCommentsList((prev) => [...prev, newComment]),
    );
    return () => socket.disconnect();
  }, [id]);

  const sendComment = async () => {
    if (!comment.trim()) return;
    await fetch("http://localhost:3000/addcomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blogId: id,
        text: comment,
        username: user?.name || "Anonymous",
        rating: 5,
      }),
      credentials: "include",
    });
    setComment("");
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    const res = await fetch("http://localhost:3000/deletecomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blogId: id, commentId }),
      credentials: "include",
    });
    if (res.ok)
      setCommentsList((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (!blog)
    return (
      <div
        className="detail-container"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Loading...
      </div>
    );

  return (
    <div className="detail-container">
      <h1 className="detail-title">{blog.title}</h1>
      <span className="blog-date">
        {new Date(blog.createdAt).toDateString()}
      </span>

      {blog.image && (
        <img src={blog.image} className="detail-img" alt={blog.title} />
      )}

      {/* ✨ AI SUMMARY SECTION */}
      {blog.aiSummary && (
        <div className="ai-summary-card">
          <div className="ai-header">
            <span style={{ fontSize: "1.2rem" }}>✨</span>
            <strong>Gemini AI Summary</strong>
          </div>
          <p>{blog.aiSummary}</p>
        </div>
      )}

      {/* RENDER RICH TEXT HTML */}
      <div
        className="detail-body"
        dangerouslySetInnerHTML={{ __html: blog.body }}
      />

      <div className="comments-section">
        <h3>Comments ({commentsList.length})</h3>

        {user ? (
          <div className="comment-input-wrapper">
            <textarea
              className="comment-box"
              placeholder="Write a thoughtful comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn-primary" onClick={sendComment}>
              Post Comment
            </button>
          </div>
        ) : (
          <div className="login-prompt">
            Please <b>Login</b> to join the conversation.
          </div>
        )}

        <div className="comments-list">
          {commentsList.map((c, i) => {
            // Moderator Logic
            const isMyComment = user && user.id === c.userId;
            const isMyBlog = user && blog.userId === user.id;
            const isAdmin = user && user.role === "admin";

            if (isMyComment || isMyBlog || isAdmin) {
              return (
                <div key={i} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-user">{c.username}</span>
                    <button
                      className="btn-delete-sm"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              );
            } else {
              return (
                <div key={i} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-user">{c.username}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
