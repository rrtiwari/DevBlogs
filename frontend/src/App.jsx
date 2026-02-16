import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast"; 
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddBlog from "./pages/AddBlog";
import BlogDetails from "./pages/BlogDetails";
import MyBlogs from "./pages/MyBlogs";
import EditBlog from "./pages/EditBlog";
import AdminDashboard from "./pages/AdminDashboard";
import { API_URL } from "./config";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(`${API_URL}/check-session`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log("Server error");
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, { credentials: "include" });
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      {/* 2. Add the Toaster here with custom settings */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/addblog" element={<AddBlog />} />
        <Route path="/blog/:id" element={<BlogDetails user={user} />} />
        <Route path="/myblog" element={<MyBlogs />} />
        <Route path="/editblog/:id" element={<EditBlog />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
