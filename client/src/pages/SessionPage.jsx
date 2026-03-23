import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function SessionPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  async function loadQuestions() {
    const { data } = await api.get(`/sessions/${id}/questions`);
    setQuestions(data);
  }

  async function loadReport() {
    const { data } = await api.get(`/sessions/${id}/report`);
    setReport(data);
  }

  useEffect(() => {
    Promise.all([loadQuestions(), loadReport()]).catch(() => setError("Failed to load session"));
  }, [id]);

  async function generateQuestions() {
    setLoading(true);
    setError("");
    try {
      await api.post(`/sessions/${id}/generate-questions`);
      await loadQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  }

  async function submitAndEvaluate(questionId) {
    const text = answers[questionId]?.trim();
    if (!text) return;

    setError("");
    try {
      const submitted = await api.post("/answers", {
        questionId,
        sessionId: id,
        text,
        durationSec: 0
      });

      await api.post(`/answers/${submitted.data._id}/evaluate`);
      await loadReport();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to evaluate answer");
    }
  }

  return (
    <div className="container page-stack">
      <section className="card page-stack">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="card-title">Interview Session</h2>
            <p className="card-subtitle">Generate AI questions and submit answers for evaluation.</p>
          </div>
          <button onClick={generateQuestions} disabled={loading}>
            {loading ? "Generating..." : "Generate AI Questions"}
          </button>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="kpi">
          <span className="kpi-chip">Questions: {questions.length}</span>
          <span className="kpi-chip">Drafted: {answeredCount}</span>
          <span className="kpi-chip">Avg Score: {report?.stats?.averageScore ?? 0}/10</span>
        </div>
      </section>

      <section className="page-stack">
        {questions.map((q, idx) => (
          <article key={q._id} className="card page-stack">
            <div>
              <h3 className="card-title">Q{idx + 1}. {q.text}</h3>
              <p className="small">{q.category} | {q.difficulty}</p>
            </div>

            <textarea
              rows={5}
              placeholder="Write your answer here"
              value={answers[q._id] || ""}
              onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
            />

            <button onClick={() => submitAndEvaluate(q._id)}>Submit + Get Feedback</button>
          </article>
        ))}
      </section>

      <section className="card page-stack">
        <div>
          <h2 className="card-title">Performance Report</h2>
          <p className="card-subtitle">Review strengths and improvement suggestions from AI feedback.</p>
        </div>

        {!report ? <p className="small">No report yet.</p> : (
          <>
            <div className="kpi">
              <span className="kpi-chip">Answered: {report.stats.answered}</span>
              <span className="kpi-chip">Feedbacks: {report.stats.feedbackCount}</span>
              <span className="kpi-chip">Average Score: {report.stats.averageScore}/10</span>
            </div>

            <div className="grid">
              {report.feedbacks.map((f) => (
                <article className="card page-stack" key={f._id}>
                  <h4 className="card-title">Score: {f.score}/10</h4>
                  <p className="small"><strong>Strengths:</strong> {f.strengths.join(", ") || "-"}</p>
                  <p className="small"><strong>Improvements:</strong> {f.improvements.join(", ") || "-"}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
