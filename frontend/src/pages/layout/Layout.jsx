import { useContext, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import "./layout.scss";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="layout">
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      {/* <div className="footer"> */}
      {/* <Footer /> */}
      {/* </div> */}
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

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
      {/* <div className="footer"> */}
      {/* <Footer /> */}
      {/* </div> */}
    </div>
  );
}

export { Layout, RequireAuth };
