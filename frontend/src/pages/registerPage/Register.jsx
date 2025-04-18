import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import apiRequest from "../../lib/apiRequest";
import "../../auth.scss";
import { toast } from "react-toastify";

function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username")?.trim();
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();
    const confirmPassword = formData.get("confirmPassword")?.trim();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await apiRequest.post("/auth/register", { username, email, password });
      toast.success("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="container">
        <div className="formSection">
          <h1>Register Yourself</h1>
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <AiOutlineUser />
              <input name="username" required placeholder="Username" />
            </div>
            <div className="inputGroup">
              <AiOutlineMail />
              <input name="email" type="email" required placeholder="Email" />
            </div>
            <div className="inputGroup">
              <FiLock />
              <input
                name="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggleBtn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="inputGroup">
              <FiLock />
              <input
                name="confirmPassword"
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggleBtn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <button disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <Link to="/login">Already have an account?</Link>
          </form>
        </div>
        <div className="imageSection" />
      </div>
    </div>
  );
}

export default Register;
