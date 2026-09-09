import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin, loginUser } from "../services/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Sign in as an administrator or citizen to access the skilling outcomes platform.",
      },
      { property: "og:title", content: "Login | Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Administrator and citizen sign-in for the skilling outcomes platform.",
      },
    ],
  }),
  validateSearch: (search) => (search.registered === "1" ? { registered: "1" } : {}),
  component: LoginPage,
});

export default function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const showRegistrationMessage = search.registered === "1";
  const [role, setRole] = useState("citizen");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    if (role === "admin") {
      await loginAdmin({ email: form.email.trim(), password: form.password });
      navigate({ to: "/admin" });
    } else {
      await loginUser({ email: form.email.trim(), password: form.password });
      navigate({ to: "/dashboard" });
    }
    setSubmitting(false);
  }

  const isAdmin = role === "admin";

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-intro">
          <span className="navbar-mark">LS</span>
          <h1>Longitudinal Skilling Outcomes and Impact Measurement Platform</h1>
          <p>Sign in as an administrator or citizen to continue to the appropriate dashboard.</p>
        </div>

        <div className="card auth-card">
          <div className="card-header">
            <div className="login-toggle" role="group" aria-label="Choose login type">
              <button
                type="button"
                className={!isAdmin ? "is-selected" : ""}
                onClick={() => setRole("citizen")}
              >
                Citizen Login
              </button>
              <button
                type="button"
                className={isAdmin ? "is-selected" : ""}
                onClick={() => setRole("admin")}
              >
                Admin Login
              </button>
            </div>
            <h2>{isAdmin ? "Administrator Login" : "Citizen Login"}</h2>
            <p className="muted">
              {isAdmin
                ? "Use the administrator demo account to review registrations."
                : "Sign in with your registered citizen account."}
            </p>
          </div>

          {showRegistrationMessage ? (
            <p className="alert alert-success" role="status">
              Registration successful. Please log in to continue.
            </p>
          ) : null}

          <p className="alert alert-demo" role="note">
            Demo login: {isAdmin ? "admin@example.com / admin123" : "rahul@example.com / citizen123"}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password ? <p className="field-error">{errors.password}</p> : null}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Signing in..." : isAdmin ? "Login as Administrator" : "Login as Citizen"}
            </button>
          </form>

          {!isAdmin ? (
            <p className="form-note">
              New citizen? <Link to="/register">Create an account</Link>
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
