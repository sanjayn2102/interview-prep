import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="container">
        <div className="brand">
          <strong>Interview Prep AI</strong>
          <span className="small">Practice smarter, interview sharper</span>
        </div>

        <div className="nav-links">
          <Link className="pill-link" to="/">Dashboard</Link>
          {!isAuthenticated ? <Link className="pill-link" to="/login">Login</Link> : null}
          {!isAuthenticated ? <Link className="pill-link" to="/register">Register</Link> : null}
          {isAuthenticated ? <span className="small">Hi, {user?.name}</span> : null}
          {isAuthenticated ? <button onClick={logout}>Logout</button> : null}
        </div>
      </div>
    </nav>
  );
}
