import { Link, useNavigate } from "@tanstack/react-router";
import { logoutUser } from "../services/api";

/**
 * Top navigation for the admin panel pages.
 */
export default function AdminNavbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate({ to: "/admin/login" });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/admin" className="navbar-brand">
          <span className="navbar-mark">AD</span>
          <span>
            <strong>Admin Panel</strong>
            <small>Longitudinal Skilling Outcomes &amp; Impact Measurement</small>
          </span>
        </Link>

        <nav className="navbar-links" aria-label="Admin navigation">
          <Link to="/admin" activeProps={{ className: "is-active" }}>
            Trainees
          </Link>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
