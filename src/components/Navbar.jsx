import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSession, logoutUser } from "../services/api";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  User,
  GraduationCap,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const session = useSession();

  const isTrainee = session?.role === "citizen";
  const isEmployer = session?.role === "employer";
  const isAdmin = session?.role === "admin";

  async function handleLogout() {
    await logoutUser();
    navigate({ to: "/login" });
  }

  return (
    <header className="bg-[#12315c] text-white border-b-4 border-[#1a6b4f] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Portal Identity */}
        <Link
          to={isEmployer ? "/employer" : isAdmin ? "/admin" : "/dashboard"}
          className="flex items-center gap-3 text-white no-underline group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#1a6b4f] flex items-center justify-center font-bold text-lg tracking-wider text-white shadow-sm ring-2 ring-white/10 shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight tracking-tight flex items-center gap-2">
              National Skilling Outcomes Portal
              <span className="text-[10px] bg-emerald-700/80 uppercase px-1.5 py-0.2 rounded font-semibold tracking-wider text-emerald-100 border border-emerald-500/30">
                SIH Outcome Engine
              </span>
            </div>
            <div className="text-xs text-slate-300 font-normal leading-snug">
              Longitudinal Outcome Tracking &amp; Impact Measurement
            </div>
          </div>
        </Link>

        {/* Navigation Links per role */}
        <nav
          className="flex items-center gap-1 sm:gap-2 flex-wrap text-sm"
          aria-label="Portal Navigation"
        >
          {isTrainee && (
            <>
              <Link
                to="/dashboard"
                activeProps={{ className: "bg-white/15 text-white font-semibold" }}
                className="px-3 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Briefcase className="w-4 h-4 text-emerald-300" />
                Trainee Dashboard
              </Link>
              <Link
                to="/profile"
                activeProps={{ className: "bg-white/15 text-white font-semibold" }}
                className="px-3 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-sky-300" />
                Profile &amp; Consent
              </Link>
            </>
          )}

          {isEmployer && (
            <>
              <Link
                to="/employer"
                activeProps={{ className: "bg-white/15 text-white font-semibold" }}
                className="px-3 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                Verification Desk
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                activeProps={{ className: "bg-white/15 text-white font-semibold" }}
                className="px-3 py-1.5 rounded-md text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                Outcome Analytics &amp; Monitoring
              </Link>
            </>
          )}

          {/* User badge info */}
          <div className="hidden lg:flex items-center gap-2 pl-3 ml-2 border-l border-white/20 text-xs">
            <div className="text-right">
              <div className="font-semibold text-white truncate max-w-[160px]">
                {session?.name || "User"}
              </div>
              <div className="text-[11px] text-emerald-300">
                {isEmployer
                  ? `Company: ${session?.companyName || "Employer"}`
                  : isAdmin
                    ? `Scope: ${session?.scope || "Super Admin"}`
                    : `Trainee ID: ${session?.traineeId || "TRN-1001"}`}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            id="btn-navbar-logout"
            onClick={handleLogout}
            className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-rose-900/60 px-3 py-1.5 rounded-md border border-white/20 hover:border-rose-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
