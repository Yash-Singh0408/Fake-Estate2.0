import { useContext } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import "./layout.scss";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify"; 

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

  
  // if (!currentUser) {
  //   toast.warning("You need to log in to access this page! ⚠️");
  //   return <Navigate to="/login" />;
  // }

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
