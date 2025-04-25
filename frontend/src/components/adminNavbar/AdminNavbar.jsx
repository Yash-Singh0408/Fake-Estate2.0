import { useContext } from "react";
import "./adminNavbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  LogOut,
} from "lucide-react";

function AdminNavbar() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sideNavbar">
      <div className="logo">
        {/* <img src="/logo.png" alt="Logo"  /> */}
        <span>AdminPanel</span>
      </div>

      <div className="navLinks">
        <NavLink to="/admin" end  className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
          <LayoutDashboard />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
          <Users />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/properties" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
          <Building2 />
          <span>Properties</span>
        </NavLink>
        {/* <NavLink to="/admin/requests" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
          <FileText />
          <span>Requests</span>
        </NavLink> */}
        <NavLink to="/admin/updateProfile" className={({ isActive }) => isActive ? "navItem active" : "navItem"}>
          <img src={currentUser?.avatar || "/noavatar.jpg"} alt="Admin Avatar" className="admin-avatar" />
          <span>Profile</span>
        </NavLink>
        <div className="navItem logout" onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
