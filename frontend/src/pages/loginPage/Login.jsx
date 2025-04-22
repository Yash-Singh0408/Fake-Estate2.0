import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "../../auth.scss";
import { toast } from "react-toastify";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username")?.trim();
    const password = formData.get("password")?.trim();

    if (!username || !password) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiRequest.post("/auth/login", { username, password });
      updateUser(res.data);
     
      if (res.data.isAdmin) {
        toast.success("Welcome Admin!");
        navigate("/admin");
      } else {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="container">
        <div className="formSection">
          <h1>Welcome Back</h1>
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <AiOutlineUser />
              <input name="username" required placeholder="Username" />
            </div>
            <div className="inputGroup">
              <FiLock />
              <input
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <button
                type="button"
                className="toggleBtn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {/* {error && <span>{error}</span>} */}
            <Link to="/register">Dont have an account?</Link>
          </form>
        </div>
        <div className="imageSection" />
      </div>
    </div>
  );
}

export default Login;
