import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { registerUser } from "../services/api";
import { mockCourses, mockProviders } from "../services/mockData";
import { GraduationCap, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

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

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  district: "Kolkata",
  state: "West Bengal",
  course: mockCourses[0],
  provider: mockProviders[0],
  consent: true,
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
    if (!form.consent)
      nextErrors.consent = "Consent for longitudinal outcome tracking is mandatory.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await registerUser({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      district: form.district.trim(),
      state: form.state.trim(),
      course: form.course,
      provider: form.provider,
      consent: form.consent,
    });
    setSubmitting(false);
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#12315c] text-white p-6 sm:p-8 border-b-4 border-[#1a6b4f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1a6b4f] flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
                Trainee Onboarding
              </span>
              <h1 className="text-xl sm:text-2xl font-bold mt-1">
                Register for Skilling Outcomes Tracking
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Enroll your completed vocational qualification into the National Longitudinal Tracking
            System to enable employer verification, career retention follow-up, and wage growth
            certification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name (as per Aadhaar/Cert)
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-phone"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Mobile Phone Number
              </label>
              <input
                id="reg-phone"
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
              {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Account Password
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-district"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                District
              </label>
              <input
                id="reg-district"
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g. Kolkata"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
              {errors.district && <p className="text-xs text-rose-600 mt-1">{errors.district}</p>}
            </div>

            <div>
              <label
                htmlFor="reg-state"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                State
              </label>
              <input
                id="reg-state"
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. West Bengal"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
              {errors.state && <p className="text-xs text-rose-600 mt-1">{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="reg-course"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Completed Vocational Course
              </label>
              <select
                id="reg-course"
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none bg-white"
              >
                {mockCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="reg-provider"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Training Provider / Centre
              </label>
              <select
                id="reg-provider"
                name="provider"
                value={form.provider}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none bg-white"
              >
                {mockProviders.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-800 leading-relaxed">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>
                <strong className="text-emerald-900 block font-semibold mb-0.5">
                  Statutory Consent for Longitudinal Outcome Tracking
                </strong>
                I hereby grant consent to the Ministry of Skill Development &amp; Entrepreneurship
                (MSDE) and authorized training partners to collect, track, and verify my
                post-training employment status, 30/90/180-day retention, and employer verification
                records for public skilling impact evaluation.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-rose-600 mt-1">{errors.consent}</p>}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <Link to="/login" className="text-xs text-slate-600 hover:text-[#12315c] font-medium">
              Already registered? Sign in instead
            </Link>

            <button
              type="submit"
              id="btn-register-submit"
              disabled={submitting}
              className="bg-[#12315c] hover:bg-[#0d2445] text-white font-semibold py-2.5 px-6 rounded-md text-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
            >
              {submitting ? "Registering..." : "Complete Registration"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
