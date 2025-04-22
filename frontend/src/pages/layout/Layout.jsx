import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import "./layout.scss";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";

// Regular public layout
function Layout() {

  const { currentUser } = useContext(AuthContext);
  if (currentUser && currentUser.isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="layout">
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

// Authenticated user layout
function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.isAdmin) return <Navigate to="/admin" />;

  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="layout">
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

// Admin-only layout
function AdminLayout() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  if (!currentUser.isAdmin) return <Navigate to="/" />;

  return (
    <div className="admin-layout">
      <div className="admin-nav">
        <AdminNavbar />
      </div>
      <div className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export { Layout, RequireAuth, AdminLayout };
