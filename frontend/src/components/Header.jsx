import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="header">
      <div className="brand" onClick={() => navigate("/")}>
        ✏️ DevBlog
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/myblog" className="nav-link">
              My Blogs
            </Link>

            {/* --- THE ADMIN BUTTON --- */}
            {/* This checks if your role is 'admin' and shows the button */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="nav-link"
                style={{
                  color: "#ff385c",
                  fontWeight: "800",
                  border: "1px solid #ff385c",
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                Admin Panel
              </Link>
            )}

            <Link to="/addblog" className="write-btn">
              Write Article
            </Link>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-login"
              style={{ background: "transparent", border: "none" }}
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
