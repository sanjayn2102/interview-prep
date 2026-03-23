import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({ role: "", company: "", level: "mid", topics: "" });
  const [error, setError] = useState("");

  async function loadSessions() {
    const { data } = await api.get("/sessions");
    setSessions(data);
  }

  useEffect(() => {
    loadSessions().catch(() => setError("Failed to load sessions"));
  }, []);

  async function createSession(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/sessions", {
        role: form.role,
        company: form.company,
        level: form.level,
        topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean)
      });
      setForm({ role: "", company: "", level: "mid", topics: "" });
      await loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create session");
    }
  }

  return (
    <div className="container page-stack">
      <section className="card hero">
        <h1>Build Interview Confidence With AI Coaching</h1>
        <p>Create focused sessions, answer real interview-style questions, and improve with instant feedback.</p>
      </section>

      <section className="card page-stack">
        <div>
          <h2 className="card-title">Start New Session</h2>
          <p className="card-subtitle">Define your role and target topics for personalized practice.</p>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <form onSubmit={createSession} className="form-grid">
          <input
            placeholder="Role (e.g., MERN Developer)"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            placeholder="Company (optional)"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
          <input
            placeholder="Topics (comma separated)"
            value={form.topics}
            onChange={(e) => setForm({ ...form, topics: e.target.value })}
          />
          <button type="submit">Create Session</button>
        </form>
      </section>

      <section className="card page-stack">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="card-title">Your Sessions</h2>
            <p className="card-subtitle">Continue where you left off.</p>
          </div>
          <div className="kpi">
            <span className="kpi-chip">Total: {sessions.length}</span>
          </div>
        </div>

        {sessions.length === 0 ? <p className="small">No sessions yet. Create your first one above.</p> : null}

        <div className="grid">
          {sessions.map((s) => (
            <article key={s._id} className="card session-card">
              <h3 className="card-title">{s.role}</h3>
              <p className="small">{s.company || "General"} | {s.level}</p>
              <Link className="inline-link" to={`/session/${s._id}`}>Open Session</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
