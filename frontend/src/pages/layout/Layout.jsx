import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import "./layout.scss";
import { Outlet } from "react-router-dom";

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

export default Layout;
