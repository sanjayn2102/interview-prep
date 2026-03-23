import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card page-stack">
        <div>
          <h2 className="card-title">Welcome Back</h2>
          <p className="card-subtitle">Sign in and continue your interview preparation.</p>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <form onSubmit={handleSubmit} className="page-stack">
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>

        <p className="small">No account? <Link className="inline-link" to="/register">Create one</Link></p>
      </div>
    </div>
  );
}
