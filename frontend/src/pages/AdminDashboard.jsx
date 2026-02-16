import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [view, setView] = useState("users");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:3000/admin/users", {
          credentials: "include",
        });
        const blogRes = await fetch("http://localhost:3000/admin/blogs", {
          credentials: "include",
        });

        const userData = await userRes.json();
        const blogData = await blogRes.json();

        if (userData.success) setUsers(userData.users);
        if (blogData.success) setBlogs(blogData.blogs);
      } catch (err) {
        console.error("Error fetching admin data", err);
      }
    };
    fetchData();
  }, []);

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Permanently delete this blog?")) return;
    const res = await fetch(`http://localhost:3000/deleteblog?blogId=${id}`, {
      credentials: "include",
    });
    if (res.ok) {
      setBlogs(blogs.filter((b) => b._id !== id));
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Portal</h1>
        <div className="filter-group">
          <button
            className={`btn-filter ${view === "users" ? "active" : ""}`}
            onClick={() => setView("users")}
          >
            Users ({users.length})
          </button>
          <button
            className={`btn-filter ${view === "blogs" ? "active" : ""}`}
            onClick={() => setView("blogs")}
          >
            Blogs ({blogs.length})
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>#</th>
              <th style={{ width: "40%" }}>
                {view === "users" ? "Name" : "Title"}
              </th>
              <th style={{ width: "30%" }}>
                {view === "users" ? "Email" : "Date"}
              </th>
              <th style={{ width: "20%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {view === "users"
              ? users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: "600" }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${u.role === "admin" ? "badge-admin" : "badge-user"}`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>
                  </tr>
                ))
              : blogs.map((b, i) => (
                  <tr key={b._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: "600" }}>{b.title}</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-delete-sm"
                        onClick={() => handleDeleteBlog(b._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Empty State Message */}
        {((view === "users" && users.length === 0) ||
          (view === "blogs" && blogs.length === 0)) && (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#64748b" }}
          >
            No data found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
