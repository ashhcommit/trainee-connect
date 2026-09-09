import React, { useState } from "react";
import { Server, Database, ShieldCheck, ChevronUp, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export default function PrototypeBackendNotice() {
  const [expanded, setExpanded] = useState(false);

  return (
    <footer
      id="prototype-architecture-notice"
      className="bg-slate-900 border-t border-slate-700 text-slate-300 text-xs py-3 px-4 z-40 relative select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-950/80 border border-amber-700 text-amber-300 font-semibold text-[11px] px-2 py-0.5 rounded">
              <Server className="w-3 h-3" />
              Prototype Architecture Notice
            </span>
            <span className="text-slate-400 text-xs hidden md:inline">
              Simulated Client-Side State Layer (Local Data Store)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-slate-400 text-[11px]">
              Ready for Express + MongoDB Backend Integration
            </span>
            <button
              type="button"
              id="btn-toggle-backend-notice"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 bg-slate-800 hover:bg-slate-750 px-2 py-1 rounded border border-slate-700 transition-colors"
            >
              {expanded ? "Hide Details" : "Why a Backend is Needed"}
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Frontend Prototype Capabilities (Currently Demonstrated)
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                <li>End-to-end user workflows for Trainee, Employer, and Admin</li>
                <li>Reactive local store persisting verifications and 30/90/180-day follow-ups</li>
                <li>Company and administrative scope isolation (State, District, Programme)</li>
                <li>Instant role switching with strict client-side RBAC security boundaries</li>
                <li>Structured API service layer ready for drop-in REST replacement</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                Why a Real Backend (Express + MongoDB) is Required for Production
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                <li>
                  <strong className="text-slate-300">Server-Side RBAC &amp; JWT:</strong> Client-side
                  checks cannot protect sensitive PII against browser console manipulation.
                </li>
                <li>
                  <strong className="text-slate-300">Centralized Database:</strong> Allows employer
                  HR actions to sync across devices instead of local browser memory.
                </li>
                <li>
                  <strong className="text-slate-300">Automated Magic Links &amp; Reminders:</strong>{" "}
                  Cron jobs for 30/90/180-day SMS/WhatsApp follow-ups and secure employer verification
                  tokens.
                </li>
                <li>
                  <strong className="text-slate-300">Data Integrity &amp; Audit Logs:</strong>{" "}
                  Tamper-proof logs for government skilling fund disbursements.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
