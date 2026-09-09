import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSession, switchSessionRole, logoutUser } from "../services/api";
import { ShieldAlert, ArrowRight, UserCheck, LogOut, ArrowLeft } from "lucide-react";

export default function ProtectedRoute({ children, role = "citizen" }) {
  const navigate = useNavigate();
  const session = useSession();

  const expectedRole = role === "trainee" ? "citizen" : role;
  const sessionRole = session?.role === "trainee" ? "citizen" : session?.role;

  // 1. Not logged in at all -> redirect to login
  if (!session) {
    const loginPath = role === "admin" ? "/admin/login" : "/login";
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Authentication Required</h2>
          <p className="text-xs text-slate-600 mt-1 mb-5">
            You must be signed in to access this portal section.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: loginPath })}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#12315c] text-white py-2.5 px-4 rounded-lg text-xs font-semibold hover:bg-[#1a447e] transition-colors"
          >
            Go to Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Role mismatch (e.g. Employer trying to view Trainee page or vice versa)
  if (sessionRole !== expectedRole) {
    const myHomePath =
      sessionRole === "admin"
        ? "/admin"
        : sessionRole === "employer"
          ? "/employer"
          : "/dashboard";

    const myRoleLabel =
      sessionRole === "citizen"
        ? "Trainee"
        : sessionRole === "employer"
          ? `Employer (${session.companyName || "Organization"})`
          : `Administrator (${session.scope || "Oversight"})`;

    const expectedRoleLabel =
      expectedRole === "citizen"
        ? "Trainee"
        : expectedRole === "employer"
          ? "Employer Verification Officer"
          : "Administrative Officer";

    async function handleAutoSwitch() {
      if (expectedRole === "citizen") {
        await switchSessionRole("citizen", "TRN-1001");
      } else if (expectedRole === "employer") {
        await switchSessionRole("employer", "ABC Technologies");
      } else if (expectedRole === "admin") {
        await switchSessionRole("admin", "Super Admin");
      }
    }

    async function handleLogout() {
      await logoutUser();
      navigate({ to: "/login" });
    }

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-amber-600 text-white p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-700/70 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">
                Role Authorization Boundary
              </h2>
              <p className="text-xs text-amber-100 mt-0.5">
                Role-Based Access Control (RBAC) Enforcement
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4 text-xs text-slate-700">
            <p className="text-sm leading-relaxed">
              This section is restricted to <strong>{expectedRoleLabel}</strong> accounts.
              You are currently authenticated as:
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">{session.name}</div>
                <div className="text-slate-500 text-xs">{myRoleLabel}</div>
              </div>
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                Active Session
              </span>
            </div>

            <div className="pt-2 space-y-2.5">
              <Link
                to={myHomePath}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#12315c] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#1a447e] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to My Authorized Dashboard ({myRoleLabel.split("(")[0].trim()})
              </Link>

              <button
                type="button"
                onClick={handleAutoSwitch}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Switch Persona to {expectedRoleLabel} (Demo Evaluator)
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-rose-700 py-1.5 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out / Switch Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> render page
  return <>{children}</>;
}
