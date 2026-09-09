import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldAlert,
  Award,
  Briefcase,
} from "lucide-react";

/**
 * Standardized status badge component adhering to public-sector design standards.
 * Types supported:
 * - employment: Employed, Self-employed, Apprentice, Unemployed
 * - verification: Pending, Verified, Rejected, Not applicable
 * - certification: Certified, Pending, Not Certified
 * - followup: Completed, Pending, Overdue
 */
export default function StatusBadge({ type = "verification", value = "", size = "md" }) {
  const norm = String(value).trim().toLowerCase();
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1 font-medium";

  // VERIFICATION
  if (type === "verification") {
    if (norm === "verified") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Verified
        </span>
      );
    }
    if (norm === "rejected") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          Rejected
        </span>
      );
    }
    if (norm === "pending" || norm.includes("pending")) {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          Pending Verification
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
      >
        Not applicable
      </span>
    );
  }

  // EMPLOYMENT
  if (type === "employment") {
    if (norm === "employed") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 ${sizeClasses}`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          Employed
        </span>
      );
    }
    if (norm === "self-employed") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 ${sizeClasses}`}
        >
          <Briefcase className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
          Self-employed
        </span>
      );
    }
    if (norm === "apprentice") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 ${sizeClasses}`}
        >
          <Award className="w-3.5 h-3.5 text-purple-700 shrink-0" />
          Apprentice
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 ${sizeClasses}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        Unemployed
      </span>
    );
  }

  // CERTIFICATION
  if (type === "certification") {
    if (norm === "certified") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Certified
        </span>
      );
    }
    if (norm === "not certified") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          Not Certified
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        Pending Assessment
      </span>
    );
  }

  // FOLLOW-UP
  if (type === "followup") {
    if (norm === "completed") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Completed
        </span>
      );
    }
    if (norm === "overdue") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300 ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          Overdue
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        Pending
      </span>
    );
  }

  // FLAGGED / AUDIT
  if (type === "flagged") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 ${sizeClasses}`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        Flagged for Review
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
    >
      {value}
    </span>
  );
}
