import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card page-stack">
        <div>
          <h2 className="card-title">Create Account</h2>
          <p className="card-subtitle">Set up your profile to start mock interview sessions.</p>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <form onSubmit={handleSubmit} className="page-stack">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <button type="submit">Create account</button>
        </form>

        <p className="small">Already have an account? <Link className="inline-link" to="/login">Login</Link></p>
      </div>
    </div>
  );
}
