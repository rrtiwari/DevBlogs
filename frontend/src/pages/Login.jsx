import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // Import Toast

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false); // Loading State

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start Loading

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        if (isAdminLogin && data.user.role !== "admin") {
          toast.error("🚫 Access Denied: You are not an Admin.");
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        toast.success(`Welcome back, ${data.user.name}!`);

        // Short delay before reload
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error(data.message || "Invalid Credentials");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Network Error. Check your connection.");
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={isAdminLogin ? { borderColor: "#ff385c" } : {}}
    >
      <div className="auth-header">
        <h2
          className="auth-title"
          style={isAdminLogin ? { color: "#ff385c" } : {}}
        >
          {isAdminLogin ? "Admin Portal" : "Welcome Back"}
        </h2>
        <p className="auth-subtitle">
          {isAdminLogin
            ? "Secure access for administrators"
            : "Login to access your account"}
        </p>
      </div>

      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          className="auth-input"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="auth-btn"
          disabled={loading}
          style={isAdminLogin ? { background: "#ff385c" } : {}}
        >
          {/* Dynamic Button Text */}
          {loading
            ? "Authenticating..."
            : isAdminLogin
              ? "Unlock Dashboard"
              : "Sign In"}
        </button>
      </form>

      <div className="auth-footer">
        {isAdminLogin ? (
          <p>
            Not an admin?{" "}
            <span
              className="toggle-link"
              onClick={() => setIsAdminLogin(false)}
            >
              User Login
            </span>
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div className="auth-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
            <button
              className="btn-admin-toggle"
              onClick={() => setIsAdminLogin(true)}
            >
              🔐 Login as Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
