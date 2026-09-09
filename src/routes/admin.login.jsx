import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "../services/api";
import { ShieldCheck, ArrowRight, Info, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Administrator Sign In | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Administrator sign-in for skilling outcomes monitoring, analytics, and data quality oversight.",
      },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@msde.gov.in", password: "demo-password" });
  const [scope, setScope] = useState("Super Admin");
  const [submitting, setSubmitting] = useState(false);

  function handleSelectScope(s, email) {
    setScope(s);
    setForm({ email, password: "demo-password" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await loginAdmin({ email: form.email.trim(), password: form.password });
    setSubmitting(false);
    navigate({ to: "/admin" });
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#12315c] text-white p-6 border-b-4 border-[#1a6b4f]">
          <div className="w-12 h-12 rounded-lg bg-[#1a6b4f] flex items-center justify-center font-bold text-white mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
            Monitoring &amp; Oversight Desk
          </span>
          <h1 className="text-xl font-bold mt-2">Administrator Sign In</h1>
          <p className="text-xs text-slate-300 mt-1">
            Access analytics, 30/90/180-day retention curves, and skill gap telemetry.
          </p>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Quick Scope Selectors */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Select Administrative Scope:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectScope("Super Admin", "admin@msde.gov.in")}
                className={`p-2 rounded text-left border transition-colors ${
                  scope === "Super Admin"
                    ? "bg-sky-50 text-sky-900 border-sky-300 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Super Admin (All India)
              </button>
              <button
                type="button"
                onClick={() => handleSelectScope("State Admin", "wb.admin@skills.gov.in")}
                className={`p-2 rounded text-left border transition-colors ${
                  scope === "State Admin"
                    ? "bg-sky-50 text-sky-900 border-sky-300 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                State Admin (West Bengal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectScope("District Admin", "jaipur.admin@skills.gov.in")}
                className={`p-2 rounded text-left border transition-colors ${
                  scope === "District Admin"
                    ? "bg-sky-50 text-sky-900 border-sky-300 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                District Admin (Jaipur)
              </button>
              <button
                type="button"
                onClick={() => handleSelectScope("Programme Admin", "pmkvy.admin@skills.gov.in")}
                className={`p-2 rounded text-left border transition-colors ${
                  scope === "Programme Admin"
                    ? "bg-sky-50 text-sky-900 border-sky-300 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Prog Admin (PMKVY Digital)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="admin-email" className="block font-semibold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-pass" className="block font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#12315c] hover:bg-[#0d2445] text-white font-semibold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
            >
              {submitting ? "Signing in..." : "Enter Monitoring Console"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-200 text-center">
            <Link to="/login" className="text-slate-600 hover:text-[#12315c] font-medium">
              ← Return to Main Portal Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
