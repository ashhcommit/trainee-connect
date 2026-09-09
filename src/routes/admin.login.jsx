import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "../services/api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Administrator Login | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Administrator sign-in for reviewing trainee registrations on the skilling outcomes measurement platform.",
      },
      { property: "og:title", content: "Administrator Login | Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Secure administrator sign-in for the skilling outcomes measurement platform.",
      },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await loginAdmin({ email: form.email.trim(), password: form.password });
    setSubmitting(false);
    navigate({ to: "/admin" });
  }

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-intro">
          <span className="navbar-mark">AD</span>
          <h1>Administrator Access</h1>
          <p>
            Review trainee registrations, verify consent, and approve records for
            longitudinal outcome tracking.
          </p>
        </div>

        <div className="card auth-card">
          <div className="card-header">
            <h2>Administrator Login</h2>
            <p className="muted">Sign in with your official administrator email.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password ? <p className="field-error">{errors.password}</p> : null}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Signing in..." : "Login as Administrator"}
            </button>
          </form>

          <p className="form-note">
            Trainee instead? <Link to="/login">Go to trainee login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
