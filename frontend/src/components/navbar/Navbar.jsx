import { useState } from "react";
import "./navbar.scss";

function Navbar() {

  const [open , setOpen] = useState(false)

  return (
    <nav>
      <div className="left">
        <a className="logo" href="/">
          <img  src="/logo.png" alt="logo" />
          <span>Fake Estate</span>
        </a>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Agents</a>
      </div>
      <div className="right">
        <a href="/">Sign in</a>
        <a href="/" className="register">Sign up</a>
        <div className="menuIcon">
          <img src="/menu.png" alt="hamburger" onClick={() => setOpen(!open)} />
        </div>
        <div className={open ? "menu active" : "menu"}>
        <a href="/">Home</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Agents</a>
        <a href="/">Sign in</a>
        <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
