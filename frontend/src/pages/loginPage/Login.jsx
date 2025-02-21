import { useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
      
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handelSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            max={30}
            min={3}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            required
            max={30}
            min={3}
            type="password"
            placeholder="Password"
          />
          <button disabled={loading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
