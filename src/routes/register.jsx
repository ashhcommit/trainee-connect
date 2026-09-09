import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { registerUser } from "../services/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Trainee Registration | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Register as a trainee on the Longitudinal Skilling Outcomes and Impact Measurement Platform.",
      },
      { property: "og:title", content: "Trainee Registration | Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Create a trainee account to record and follow up on skilling outcomes.",
      },
    ],
  }),
  component: Register,
});

// Frontend field names match the agreed contract exactly.
const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  district: "",
  state: "",
  consent: false,
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.password) nextErrors.password = "Password is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.district.trim()) nextErrors.district = "District is required.";
    if (!form.state.trim()) nextErrors.state = "State is required.";
    if (!form.consent) nextErrors.consent = "You must give consent to register.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    // Payload follows the agreed registration contract.
    await registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: "trainee",
      phone: form.phone.trim(),
      district: form.district.trim(),
      state: form.state.trim(),
      consent: form.consent,
    });
    setSubmitting(false);
    navigate({ to: "/login", search: { registered: "1" } });
  }

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-intro">
          <span className="navbar-mark">LS</span>
          <h1>Trainee Registration</h1>
          <p>
            Register once to keep your training and outcome records connected over the years
            that follow your course.
          </p>
        </div>

        <div className="card auth-card">
          <div className="card-header">
            <h2>Create your account</h2>
            <p className="muted">All fields are required.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} />
              {errors.name ? <p className="field-error">{errors.name}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
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
                autoComplete="new-password"
              />
              {errors.password ? <p className="field-error">{errors.password}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
              {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="district">District</label>
                <input
                  id="district"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                />
                {errors.district ? <p className="field-error">{errors.district}</p> : null}
              </div>

              <div className="field">
                <label htmlFor="state">State</label>
                <input id="state" name="state" value={form.state} onChange={handleChange} />
                {errors.state ? <p className="field-error">{errors.state}</p> : null}
              </div>
            </div>

            <div className="field">
              <label className="checkbox-label" htmlFor="consent">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleChange}
                />
                <span>
                  I consent to my training and employment outcome data being recorded and
                  followed up over time.
                </span>
              </label>
              {errors.consent ? <p className="field-error">{errors.consent}</p> : null}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="form-note">
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
