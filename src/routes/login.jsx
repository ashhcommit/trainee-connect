import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin, loginEmployer, loginUser } from "../services/api";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  User,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Sign In | National Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Sign in as a Trainee, Employer, or Administrator to track longitudinal employment outcomes and skill impact.",
      },
      { property: "og:title", content: "Portal Sign In | National Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Role-based sign in for skilling outcomes tracking and employer verification.",
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

  // Role: citizen (Trainee), employer, admin
  const [role, setRole] = useState("citizen");
  const [form, setForm] = useState({ email: "rahul@example.com", password: "demo-password" });
  const [selectedCompany, setSelectedCompany] = useState("ABC Technologies");
  const [adminScope, setAdminScope] = useState("Super Admin");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleRoleChange(newRole) {
    setRole(newRole);
    setErrors({});
    if (newRole === "citizen") {
      setForm({ email: "rahul@example.com", password: "demo-password" });
    } else if (newRole === "employer") {
      setForm({ email: "hr@abctechnologies.com", password: "demo-password" });
      setSelectedCompany("ABC Technologies");
    } else if (newRole === "admin") {
      setForm({ email: "admin@msde.gov.in", password: "demo-password" });
      setAdminScope("Super Admin");
    }
  }

  function handleQuickTrainee(email) {
    setRole("citizen");
    setForm({ email, password: "demo-password" });
  }

  function handleQuickEmployer(company, email) {
    setRole("employer");
    setSelectedCompany(company);
    setForm({ email, password: "demo-password" });
  }

  function handleQuickAdmin(scope, email) {
    setRole("admin");
    setAdminScope(scope);
    setForm({ email, password: "demo-password" });
  }

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
      await loginAdmin({
        email: form.email.trim(),
        password: form.password,
        scope: adminScope,
      });
      navigate({ to: "/admin" });
    } else if (role === "employer") {
      await loginEmployer({
        email: form.email.trim(),
        password: form.password,
        companyName: selectedCompany,
      });
      navigate({ to: "/employer" });
    } else {
      await loginUser({ email: form.email.trim(), password: form.password });
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Policy & Overview */}
        <div className="md:col-span-5 bg-[#12315c] text-white p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-700">
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#1a6b4f] flex items-center justify-center text-white mb-4 shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
              Government SIH Prototype
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-3 leading-snug">
              National Skilling Outcomes &amp; Impact Measurement
            </h1>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Addressing difficulties in tracking employment outcomes, skill gaps, and longitudinal
              impact of vocational training initiatives.
            </p>

            <div className="mt-6 space-y-3 text-xs border-t border-slate-700 pt-5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 text-sky-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <strong className="text-white">Trainee reports outcome</strong>: Employed,
                  apprentice, self-employed, or unemployed with skill gap notes.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <strong className="text-white">Employer verifies claims</strong>: Company-specific
                  access to verify or reject with audit trail.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <strong className="text-white">Admin monitors impact</strong>: 30/90/180-day
                  retention curve, salary progression, and skill gap insights.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-700/80 text-[11px] text-slate-400">
            Complies with National Skill Development Agency &amp; MSDE outcome tracking protocols.
          </div>
        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Select your role to access the dedicated workflow dashboard.
            </p>
          </div>

          {showRegistrationMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Registration completed successfully. Please sign in below to access your dashboard.
              </span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div
            className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg mb-5 border border-slate-200"
            role="tablist"
          >
            <button
              type="button"
              id="role-tab-citizen"
              onClick={() => handleRoleChange("citizen")}
              className={`py-2 px-2 text-xs font-semibold rounded-md transition-all flex flex-col items-center gap-1 ${
                role === "citizen"
                  ? "bg-white text-[#12315c] shadow-sm border border-slate-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4 text-sky-600" />
              Trainee
            </button>

            <button
              type="button"
              id="role-tab-employer"
              onClick={() => handleRoleChange("employer")}
              className={`py-2 px-2 text-xs font-semibold rounded-md transition-all flex flex-col items-center gap-1 ${
                role === "employer"
                  ? "bg-white text-[#12315c] shadow-sm border border-slate-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              Employer
            </button>

            <button
              type="button"
              id="role-tab-admin"
              onClick={() => handleRoleChange("admin")}
              className={`py-2 px-2 text-xs font-semibold rounded-md transition-all flex flex-col items-center gap-1 ${
                role === "admin"
                  ? "bg-white text-[#12315c] shadow-sm border border-slate-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Administrator
            </button>
          </div>

          {/* Quick Demo Pre-fill Pills */}
          <div className="mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Quick Demo Personas (Click to test scenario):
            </div>

            {role === "citizen" && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickTrainee("rahul@example.com")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    form.email === "rahul@example.com"
                      ? "bg-sky-100 text-sky-900 border-sky-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Rahul Kumar (Employed @ ABC Tech, Pending)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTrainee("anjali@example.com")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    form.email === "anjali@example.com"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Anjali Sharma (Verified @ Rajasthan Textiles)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTrainee("irfan@example.com")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    form.email === "irfan@example.com"
                      ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Mohammed Irfan (Unemployed, Skill Gaps)
                </button>
              </div>
            )}

            {role === "employer" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickEmployer("ABC Technologies", "hr@abctechnologies.com")
                    }
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                      selectedCompany === "ABC Technologies"
                        ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    ABC Technologies (Sees Rahul &amp; Tanmay)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickEmployer("Asha Industries", "hr@ashaindustries.in")}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                      selectedCompany === "Asha Industries"
                        ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Asha Industries (Meera Das &amp; Farhan)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickEmployer("XYZ Ltd", "hr@xyzltd.com")}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                      selectedCompany === "XYZ Ltd"
                        ? "bg-rose-100 text-rose-900 border-rose-300 font-semibold"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    XYZ Ltd (0 requests - Proves Company Isolation)
                  </button>
                </div>
              </div>
            )}

            {role === "admin" && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickAdmin("Super Admin", "admin@msde.gov.in")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    adminScope === "Super Admin"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Super Admin (All India)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdmin("State Admin", "wb.admin@skills.gov.in")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    adminScope === "State Admin"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  State Admin (West Bengal)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdmin("District Admin", "jaipur.admin@skills.gov.in")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    adminScope === "District Admin"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  District Admin (Jaipur)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdmin("Programme Admin", "pmkvy.lead@nsdc.org")}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    adminScope === "Programme Admin"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  Prog Admin (PMKVY)
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Official Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12315c] focus:border-[#12315c]"
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#12315c] focus:border-[#12315c]"
              />
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              id="btn-submit-login"
              disabled={submitting}
              className="w-full bg-[#12315c] hover:bg-[#0d2445] text-white font-semibold py-2.5 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
            >
              {submitting ? "Signing in..." : "Access Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {role === "citizen" && (
            <div className="mt-5 text-center text-xs text-slate-600 border-t border-slate-200 pt-4">
              Are you a new trainee?{" "}
              <Link to="/register" className="text-[#12315c] font-semibold hover:underline">
                Register for longitudinal tracking
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
