import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "../../styles/AuthForm.css";

// PUBLIC_INTERFACE
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!resp.ok) {
        throw new Error("Unable to login. Check your credentials.");
      }
      const data = await resp.json();
      login(data.access_token, email);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <div className="form-error">{error}</div>}
        <input type="email" value={email} required placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} required placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="main-btn" type="submit">Login</button>
        <div className="alt-link">
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
export default Login;
