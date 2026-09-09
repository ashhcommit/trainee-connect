import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginUser } from "../services/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Trainee Login | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Sign in to the Longitudinal Skilling Outcomes and Impact Measurement Platform to view your trainee profile.",
      },
      { property: "og:title", content: "Trainee Login | Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Secure trainee sign-in for the skilling outcomes measurement platform.",
      },
    ],
  }),
  validateSearch: (search) => ({
    registered: search.registered === "1" ? "1" : "",
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { registered } = Route.useSearch();

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
    // All backend communication goes through the API service layer.
    await loginUser({ email: form.email.trim(), password: form.password });
    setSubmitting(false);
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-intro">
          <span className="navbar-mark">LS</span>
          <h1>Longitudinal Skilling Outcomes and Impact Measurement Platform</h1>
          <p>
            A public-service platform that follows trainees after their skill-development
            training, so outcomes can be measured over time.
          </p>
        </div>

        <div className="card auth-card">
          <div className="card-header">
            <h2>Trainee Login</h2>
            <p className="muted">Sign in with your registered email address.</p>
          </div>

          {registered === "1" ? (
            <p className="alert alert-success" role="status">
              Registration successful. Please log in to continue.
            </p>
          ) : null}

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
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="form-note">
            New trainee? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
