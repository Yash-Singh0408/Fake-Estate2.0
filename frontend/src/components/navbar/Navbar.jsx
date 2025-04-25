import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink, scroller } from "react-scroll";
import { SocketContext } from "../../context/SocketContext";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (location.hash === "#aboutSection") {
      scroller.scrollTo("aboutSection", {
        smooth: true,
        duration: 500,
        offset: -70,
      });
    }
  }, [location]);

  useEffect(() => {
    if (currentUser) {
      fetch();
    }
  }, [currentUser, fetch]);

  useEffect(() => {
    if (socket && currentUser) {
      const handleNewNotification = () => {
        fetch();
      };

      socket.on("newNotification", handleNewNotification);

      return () => {
        socket.off("newNotification", handleNewNotification);
      };
    }
  }, [socket, currentUser, fetch]);

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Logo" />
          <span>FakeEstate</span>
        </Link>
        <Link to="/">Home</Link>
        {location.pathname === "/" ? (
          <ScrollLink
            to="aboutSection"
            smooth={true}
            duration={500}
            offset={-70}
            className="link"
          >
            About
          </ScrollLink>
        ) : (
          <RouterLink to={{ pathname: "/", hash: "#aboutSection" }}>
            About
          </RouterLink>
        )}
        {location.pathname === "/" ? (
          <ScrollLink
            to="testimonial"
            smooth={true}
            duration={500}
            offset={-70}
            className="link"
          >
            Testimonials
          </ScrollLink>
        ) : (
          <RouterLink to={{ pathname: "/", hash: "#testimonial" }}>
            Testimonials
          </RouterLink>
        )}
        {location.pathname === "/" ? (
          <ScrollLink
            to="homesearch"
            smooth={true}
            duration={500}
            offset={-70}
            className="link"
          >
            Search
          </ScrollLink>
        ) : (
          <RouterLink to={{ pathname: "/", hash: "#homesearch" }}>
            Search
          </RouterLink>
        )}
      </div>

      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="User" />
            <span>{currentUser.username}</span>
            {!currentUser.isAdmin && (
              <Link to="/profile" className="profile">
                {number > 0 && <div className="notification">{number}</div>}
                <span>Profile</span>
              </Link>
            )}
            {currentUser.isAdmin && (
              <Link to="/admin" className="adminLink">
                AdminPanel
              </Link>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}

        <div className="menuIcon">
          <img src="/menu.png" alt="Menu" onClick={() => setOpen(!open)} />
        </div>

        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          {location.pathname === "/" ? (
            <ScrollLink
              to="aboutSection"
              smooth={true}
              duration={500}
              offset={-70}
              className="link"
            >
              About
            </ScrollLink>
          ) : (
            <RouterLink to={{ pathname: "/", hash: "#aboutSection" }}>
              About
            </RouterLink>
          )}
          <Link to="/contact">Contact</Link>
          <Link to="/agents">Agents</Link>
          {currentUser ? (
            <>
              {!currentUser.isAdmin && <Link to="/profile">Profile</Link>}
              {currentUser.isAdmin && <Link to="/admin">Admin</Link>}
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
