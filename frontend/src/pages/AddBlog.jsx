import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import toast from "react-hot-toast"; 
import "react-quill/dist/quill.snow.css";

const AddBlog = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return toast.error("Title and Content are required!");

    setLoading(true); 

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("body", body);

    try {
      const res = await fetch("http://localhost:3000/createblog", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Blog Published Successfully!"); 
        setTimeout(() => {
          navigate("/");
        }, 1500); 
      } else {
        toast.error(data.message || "Failed to publish");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <form onSubmit={handleSubmit} className="editor-form">
        <input
          type="text"
          className="editor-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="file-upload-wrapper">
          <input type="file" onChange={handleImageChange} accept="image/*" />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="custom-file-upload">
              <span style={{ fontSize: "2rem" }}>📸</span>
              <p>Add a cover image</p>
            </div>
          )}
        </label>

        <div
          className="quill-wrapper"
          style={{ height: "300px", marginBottom: "60px" }}
        >
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            placeholder="Tell your story..."
            style={{ height: "100%" }}
          />
        </div>

        {/* 4. DYNAMIC BUTTON */}
        <button
          type="submit"
          className="btn-publish"
          disabled={loading} 
          style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
