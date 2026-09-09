import { Link, useNavigate } from "@tanstack/react-router";
import { logoutUser } from "../services/api";

/**
 * Top navigation shown on the protected pages (Dashboard and Profile).
 */
export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate({ to: "/login" });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-mark">LS</span>
          <span>
            <strong>Skilling Outcomes Platform</strong>
            <small>Longitudinal Skilling Outcomes &amp; Impact Measurement</small>
          </span>
        </Link>

        <nav className="navbar-links" aria-label="Main navigation">
          <Link to="/dashboard" activeProps={{ className: "is-active" }}>
            Dashboard
          </Link>
          <Link to="/profile" activeProps={{ className: "is-active" }}>
            Profile
          </Link>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
