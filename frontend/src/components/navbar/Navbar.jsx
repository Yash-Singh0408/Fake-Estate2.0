import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link as ScrollLink, scroller } from "react-scroll";
import { useEffect } from "react";

function Navbar() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash === "#aboutSection") {
      scroller.scrollTo("aboutSection", {
        smooth: true,
        duration: 500,
        offset: -70,
      });
    }
  }, [location]);

  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

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

        <Link to="/contact">Contact</Link>
        <Link to="/agents">Agents</Link>
      </div>

      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="User" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
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
            <Link to="/profile">Profile</Link>
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
