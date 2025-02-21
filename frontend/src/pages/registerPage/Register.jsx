import "./register.scss";
import apiRequest from "../../lib/apiRequest";
import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

function Register() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

   try {
    const res = await apiRequest.post("/auth/register", {
      username,
      email,
      password
    })
    navigate("/login");
   } catch (error) {
    setError(error.response.data.message);

   }finally{
    setLoading(false);
   }
  }

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handelSubmit}>
          <h1>Create an Account</h1>
          <input name="username" required type="text" placeholder="Username" />
          <input name="email" required type="text" placeholder="Email" />
          <input name="password" required type="password" placeholder="Password" />
          <button disabled={loading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;