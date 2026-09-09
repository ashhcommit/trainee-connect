import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession, switchSessionRole, resetMockDatabase } from "../services/api";
import { Users, Building2, ShieldCheck, RotateCcw, ChevronDown, Sparkles } from "lucide-react";

export default function QuickRoleSwitcher() {
  const navigate = useNavigate();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const currentRole = session?.role || "citizen";
  const currentName = session?.name || "Rahul Kumar";
  const currentCompany = session?.companyName || "";
  const currentScope = session?.scope || "";

  async function handleSwitch(role, targetId, path) {
    await switchSessionRole(role, targetId);
    setOpen(false);
    navigate({ to: path });
  }

  function handleReset() {
    setResetting(true);
    resetMockDatabase();
    setTimeout(() => {
      setResetting(false);
      window.location.reload();
    }, 300);
  }

  return (
    <aside
      id="quick-role-switcher-banner"
      aria-label="Prototype Role Switcher"
      className="bg-slate-900 text-slate-100 border-b border-slate-700 py-1.5 px-4 text-xs select-none sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            SIH Prototype Evaluator Mode
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300">
            Active Role:{" "}
            <strong className="text-white font-medium capitalize">
              {currentRole === "citizen" ? "Trainee" : currentRole}
            </strong>
            {currentCompany && (
              <span className="text-amber-300 font-medium"> ({currentCompany})</span>
            )}
            {currentScope && <span className="text-sky-300 font-medium"> ({currentScope})</span>}
            <span className="text-slate-400 ml-1">· {currentName}</span>
          </span>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            type="button"
            id="btn-open-role-switcher"
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-600 transition-colors font-medium"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Switch Persona / Scope
            <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          <button
            type="button"
            id="btn-reset-mock-data"
            onClick={handleReset}
            title="Reset mock database to initial state"
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 px-2 py-1 rounded border border-slate-700 hover:border-rose-800 transition-colors"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Reset Mock Data</span>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 z-50 text-slate-200">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Trainee Personas (Trainee Dashboard)
              </div>
              <div className="space-y-1 mb-3">
                <button
                  type="button"
                  onClick={() => handleSwitch("citizen", "TRN-1001", "/dashboard")}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 flex items-start justify-between group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sky-300 group-hover:text-sky-200">
                      Rahul Kumar (TRN-1001)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Employed at ABC Technologies · Pending Verification
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700">
                    Pending
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitch("citizen", "TRN-1002", "/dashboard")}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 flex items-start justify-between group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-emerald-300 group-hover:text-emerald-200">
                      Anjali Sharma (TRN-1002)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Rajasthan Textiles · Verified · 180-Day Retained
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700">
                    Verified
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitch("citizen", "TRN-1003", "/dashboard")}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 flex items-start justify-between group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-amber-300 group-hover:text-amber-200">
                      Mohammed Irfan (TRN-1003)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Unemployed · Solar PV · Skill Gap Logged
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600">
                    Unemployed
                  </span>
                </button>
              </div>

              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 border-t border-slate-800 pt-2.5">
                2. Employer Accounts (Company Isolation)
              </div>
              <div className="space-y-1 mb-3">
                <button
                  type="button"
                  onClick={() => handleSwitch("employer", "ABC Technologies", "/employer")}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 flex items-start justify-between group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400" />
                      ABC Technologies
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Sees verification claims for Rahul Kumar &amp; Tanmay Sen
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-900/40 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700">
                    2 Pending
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitch("employer", "Asha Industries", "/employer")}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 flex items-start justify-between group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Asha Industries
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Sees Meera Das (Pending) &amp; Farhan Akhtar (Verified)
                    </div>
                  </div>
                  <span className="text-[10px] bg-sky-900/40 text-sky-300 px-1.5 py-0.5 rounded border border-sky-700">
                    1 Pending
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitch("employer", "XYZ Ltd", "/employer")}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 flex items-start justify-between group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-rose-300 group-hover:text-rose-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-rose-400" />
                      XYZ Ltd (Proves Isolation)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Must NOT see Rahul or Asha records (0 requests)
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    0 Records
                  </span>
                </button>
              </div>

              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 border-t border-slate-800 pt-2.5">
                3. Admin Scopes (Analytics &amp; Monitoring)
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitch("admin", "Super Admin", "/admin")}
                  className="p-1.5 rounded text-left hover:bg-slate-800 text-sky-300 text-[11px] font-medium border border-slate-800 hover:border-sky-700 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
                  Super Admin (All India)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitch("admin", "State Admin", "/admin")}
                  className="p-1.5 rounded text-left hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 hover:border-slate-600 transition-colors"
                >
                  State: West Bengal
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitch("admin", "District Admin", "/admin")}
                  className="p-1.5 rounded text-left hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 hover:border-slate-600 transition-colors"
                >
                  District: Jaipur
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitch("admin", "Programme Admin", "/admin")}
                  className="p-1.5 rounded text-left hover:bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-800 hover:border-slate-600 transition-colors"
                >
                  Prog: PMKVY Digital
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
