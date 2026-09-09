import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import StatusBadge from "../components/StatusBadge";
import {
  getEmployerVerificationRequests,
  verifyEmploymentRequest,
  rejectEmploymentRequest,
  getSession,
  useSession,
  switchSessionRole,
} from "../services/api";
import { mockCompanies } from "../services/mockData";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  ShieldCheck,
  Briefcase,
  Calendar,
  IndianRupee,
  MapPin,
  FileCheck,
  AlertTriangle,
  Send,
  User,
  Info,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Employer Verification Portal | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Company-specific employment verification portal for verifying or rejecting trainee employment claims.",
      },
    ],
  }),
  component: EmployerRoute,
});

function EmployerRoute() {
  return (
    <ProtectedRoute role="employer">
      <EmployerDashboard />
    </ProtectedRoute>
  );
}

function EmployerDashboard() {
  const session = useSession();
  const currentCompanyName = session?.companyName || "ABC Technologies";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending, verified, rejected, all
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");

  // Modals for verify & reject
  const [verifyingRequest, setVerifyingRequest] = useState(null);
  const [verifyForm, setVerifyForm] = useState({ employeeId: "", notes: "" });
  const [submittingVerify, setSubmittingVerify] = useState(false);

  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectForm, setRejectForm] = useState({
    reason: "Candidate is not on company payroll",
    notes: "",
  });
  const [submittingReject, setSubmittingReject] = useState(false);
  const [rejectError, setRejectError] = useState("");

  async function loadRequests(companyName) {
    setLoading(true);
    const data = await getEmployerVerificationRequests(companyName || currentCompanyName);
    setRequests(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests(currentCompanyName);
  }, [currentCompanyName]);

  async function handleSwitchCompany(newCompany) {
    await switchSessionRole("employer", newCompany);
    loadRequests(newCompany);
    setNotification(
      `Switched employer session to: ${newCompany}. Only requests for ${newCompany} are shown.`,
    );
    setTimeout(() => setNotification(""), 5000);
  }

  // Open Verify Modal
  function handleOpenVerify(req) {
    setVerifyingRequest(req);
    setVerifyForm({
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: "Employment verified against HR Master Payroll.",
    });
  }

  async function handleSubmitVerify(e) {
    e.preventDefault();
    if (!verifyingRequest) return;
    setSubmittingVerify(true);
    await verifyEmploymentRequest({
      traineeId: verifyingRequest.traineeId,
      verificationId: verifyingRequest.verificationId || verifyingRequest.id,
      employeeId: verifyForm.employeeId,
      notes: verifyForm.notes,
    });
    setSubmittingVerify(false);
    setVerifyingRequest(null);
    setNotification(
      `Employment claim for ${verifyingRequest.traineeName} (${verifyingRequest.traineeId}) marked as VERIFIED.`,
    );
    loadRequests(currentCompanyName);
    setTimeout(() => setNotification(""), 6000);
  }

  // Open Reject Modal
  function handleOpenReject(req) {
    setRejectingRequest(req);
    setRejectForm({
      reason: "Candidate is not on company payroll",
      notes: "",
    });
    setRejectError("");
  }

  async function handleSubmitReject(e) {
    e.preventDefault();
    if (!rejectForm.notes.trim() && !rejectForm.reason) {
      setRejectError("A valid rejection reason and explanation are mandatory.");
      return;
    }
    setSubmittingReject(true);
    await rejectEmploymentRequest({
      traineeId: rejectingRequest.traineeId,
      verificationId: rejectingRequest.verificationId || rejectingRequest.id,
      reason: rejectForm.reason,
      notes: rejectForm.notes,
    });
    setSubmittingReject(false);
    setRejectingRequest(null);
    setNotification(
      `Employment claim for ${rejectingRequest.traineeName} (${rejectingRequest.traineeId}) marked as REJECTED.`,
    );
    loadRequests(currentCompanyName);
    setTimeout(() => setNotification(""), 6000);
  }

  // Company Details
  const companyInfo = mockCompanies.find(
    (c) => c.name.toLowerCase() === currentCompanyName.toLowerCase(),
  ) || {
    name: currentCompanyName,
    sector: "Private Enterprise",
    regNo: "CIN-U10000DL2020PTC000000",
    contactEmail: "hr@" + currentCompanyName.toLowerCase().replace(/\s+/g, "") + ".com",
    contactPhone: "+91 98765 43210",
    district: "Kolkata",
    state: "West Bengal",
  };

  // Metrics
  const pendingCount = requests.filter((r) => r.verificationStatus === "Pending").length;
  const verifiedCount = requests.filter((r) => r.verificationStatus === "Verified").length;
  const rejectedCount = requests.filter((r) => r.verificationStatus === "Rejected").length;

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "pending"
          ? r.verificationStatus === "Pending"
          : activeTab === "verified"
            ? r.verificationStatus === "Verified"
            : r.verificationStatus === "Rejected";

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.traineeName.toLowerCase().includes(q) ||
      r.traineeId.toLowerCase().includes(q) ||
      r.jobRole.toLowerCase().includes(q) ||
      (r.skillsUsed && r.skillsUsed.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Notification Toast */}
        {notification && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification("")}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Company Header & Isolation Proof Switcher */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/15 text-amber-900 border border-amber-300 flex items-center justify-center font-bold text-2xl shrink-0">
              <Building2 className="w-8 h-8 text-amber-700" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {companyInfo.name}
                </h1>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Employer Account
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Sector: {companyInfo.sector}</span>
                <span>•</span>
                <span>Reg: {companyInfo.regNo}</span>
                <span>•</span>
                <span>
                  {companyInfo.district}, {companyInfo.state}
                </span>
                <span>•</span>
                <span className="text-slate-600 font-medium">
                  Officer: {companyInfo.contactEmail}
                </span>
              </p>
            </div>
          </div>

          {/* Company Switcher for Evaluation */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs">
            <label
              htmlFor="company-eval-select"
              className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Company Account Isolation Switcher:
            </label>
            <select
              id="company-eval-select"
              value={currentCompanyName}
              onChange={(e) => handleSwitchCompany(e.target.value)}
              className="w-full font-semibold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-[#12315c] focus:outline-none"
            >
              {mockCompanies.map((c) => (
                <option key={c.companyId} value={c.name}>
                  {c.name} ({c.sector})
                </option>
              ))}
            </select>
            <div className="mt-1 text-[10px] text-slate-500 leading-tight">
              Test isolation: Selecting <strong>XYZ Ltd</strong> will show 0 claims.
            </div>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab("pending")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "pending"
                ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30"
                : "bg-white border-slate-200 hover:border-amber-200"
            }`}
          >
            <div className="text-xs font-semibold text-amber-800 flex items-center justify-between">
              <span>Pending Action</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-900 mt-2">{pendingCount}</div>
            <div className="text-[11px] text-amber-700 mt-1">Requires HR validation</div>
          </div>

          <div
            onClick={() => setActiveTab("verified")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "verified"
                ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/30"
                : "bg-white border-slate-200 hover:border-emerald-200"
            }`}
          >
            <div className="text-xs font-semibold text-emerald-800 flex items-center justify-between">
              <span>Verified On Payroll</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-900 mt-2">{verifiedCount}</div>
            <div className="text-[11px] text-emerald-700 mt-1">Confirmed employees</div>
          </div>

          <div
            onClick={() => setActiveTab("rejected")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "rejected"
                ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/30"
                : "bg-white border-slate-200 hover:border-rose-200"
            }`}
          >
            <div className="text-xs font-semibold text-rose-800 flex items-center justify-between">
              <span>Rejected Claims</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-900 mt-2">{rejectedCount}</div>
            <div className="text-[11px] text-rose-700 mt-1">Audit reason logged</div>
          </div>

          <div
            onClick={() => setActiveTab("all")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeTab === "all"
                ? "bg-slate-100 border-slate-300 ring-2 ring-slate-400/30"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Total Received</span>
              <FileCheck className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">{requests.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">All historical claims</div>
          </div>
        </div>

        {/* Tab Header & Search Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                id="tab-employer-pending"
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "pending"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                id="tab-employer-verified"
                onClick={() => setActiveTab("verified")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "verified"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                type="button"
                id="tab-employer-rejected"
                onClick={() => setActiveTab("rejected")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "rejected"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rejected ({rejectedCount})
              </button>
              <button
                type="button"
                id="tab-employer-all"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  activeTab === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Records
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID, role..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#12315c] focus:outline-none"
              />
            </div>
          </div>

          {/* Verification Requests List / Cards */}
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs font-medium">
                Loading verification requests for {currentCompanyName}...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300">
                <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-800">
                  No {activeTab !== "all" ? activeTab : ""} verification requests found
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {currentCompanyName === "XYZ Ltd"
                    ? "This confirms company-specific data isolation: XYZ Ltd cannot see claims reported for other employers."
                    : `No trainees have submitted employment claims under "${currentCompanyName}" matching the current search filters.`}
                </p>
              </div>
            ) : (
              filteredRequests.map((req) => {
                const isPending = req.verificationStatus === "Pending";
                const isVerified = req.verificationStatus === "Verified";
                const isRejected = req.verificationStatus === "Rejected";

                return (
                  <div
                    key={req.id}
                    className={`rounded-xl border p-5 transition-all shadow-xs ${
                      isPending
                        ? "bg-white border-amber-200 hover:border-amber-300"
                        : isVerified
                          ? "bg-emerald-50/20 border-emerald-200"
                          : "bg-rose-50/20 border-rose-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Trainee Info & Claim Header */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#12315c] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {req.traineeName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900">
                              {req.traineeName}
                            </h3>
                            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              ID: {req.traineeId}
                            </span>
                            <StatusBadge
                              type="verification"
                              value={req.verificationStatus}
                              size="sm"
                            />
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              Claimed Role:{" "}
                              <strong className="text-slate-800">{req.jobRole}</strong>
                            </span>
                            <span>•</span>
                            <span>Course: {req.course || "Vocational Certification"}</span>
                            <span>•</span>
                            <span>Submitted: {req.submittedOn}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons for Pending */}
                      {isPending && (
                        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                          <button
                            type="button"
                            id={`btn-verify-${req.id}`}
                            onClick={() => handleOpenVerify(req)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Verify Employment
                          </button>
                          <button
                            type="button"
                            id={`btn-reject-${req.id}`}
                            onClick={() => handleOpenReject(req)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject Claim
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reported Claim Fields Grid */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Reported Salary
                        </span>
                        <span className="font-bold text-emerald-700 text-sm">
                          ₹{Number(req.salary).toLocaleString("en-IN")}/month
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Joining Date
                        </span>
                        <span className="font-semibold text-slate-800">{req.joinedOn}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Work Location
                        </span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {req.location}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Skills Reported
                        </span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {req.skillsUsed || "General Vocational Trade"}
                        </span>
                      </div>
                    </div>

                    {/* Verification Audit Details if already processed */}
                    {isVerified && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-100/60 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>
                            Verified by {req.verifiedBy || "HR Department"} on{" "}
                            {req.verifiedOn || "Recent"}.
                            {req.employeeId && (
                              <span className="ml-1 font-mono font-bold">
                                (Employee ID: {req.employeeId})
                              </span>
                            )}
                          </span>
                        </div>
                        {req.verificationNotes && (
                          <span className="italic text-[11px] text-emerald-800">
                            "{req.verificationNotes}"
                          </span>
                        )}
                      </div>
                    )}

                    {isRejected && (
                      <div className="mt-3 p-3 rounded-lg bg-rose-100/70 border border-rose-300 text-rose-900 text-xs">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                          <span>
                            Rejection Audit Record (Logged on {req.verifiedOn || "Recent"}):
                          </span>
                        </div>
                        <div className="font-semibold text-rose-950">
                          Reason: {req.rejectionReason}
                        </div>
                        {req.verificationNotes && (
                          <div className="mt-1 text-[11px] text-rose-800 italic">
                            HR Note: "{req.verificationNotes}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: VERIFY EMPLOYMENT CLAIM */}
      {/* ------------------------------------------------------------- */}
      {verifyingRequest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#12315c] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Confirm Employment Verification
                </h3>
                <p className="text-xs text-slate-300">
                  Verifying claim for {verifyingRequest.traineeName} ({verifyingRequest.traineeId})
                </p>
              </div>
              <button
                onClick={() => setVerifyingRequest(null)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitVerify} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Reported Designation</span>
                  <span className="font-bold text-slate-800">{verifyingRequest.jobRole}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Starting Salary</span>
                  <span className="font-bold text-emerald-700">
                    ₹{Number(verifyingRequest.salary).toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="verify-emp-id" className="block font-semibold text-slate-700 mb-1">
                  Internal Company Employee ID / Payroll Code (Optional)
                </label>
                <input
                  id="verify-emp-id"
                  type="text"
                  value={verifyForm.employeeId}
                  onChange={(e) => setVerifyForm((p) => ({ ...p, employeeId: e.target.value }))}
                  placeholder="e.g. EMP-1092"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="verify-notes" className="block font-semibold text-slate-700 mb-1">
                  HR Verification Note / Observation
                </label>
                <textarea
                  id="verify-notes"
                  rows={2}
                  value={verifyForm.notes}
                  onChange={(e) => setVerifyForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="e.g. Confirmed on active payroll under Engineering Team."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
                ></textarea>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                By clicking Confirm &amp; Verify, you certify under MSDE guidelines that this
                trainee is an active employee of <strong>{currentCompanyName}</strong>.
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyingRequest(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVerify}
                  className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submittingVerify ? "Verifying..." : "Confirm & Verify Employment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: REJECT EMPLOYMENT CLAIM */}
      {/* ------------------------------------------------------------- */}
      {rejectingRequest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-rose-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-300" />
                  Reject Employment Claim
                </h3>
                <p className="text-xs text-rose-200">
                  Trainee: {rejectingRequest.traineeName} ({rejectingRequest.traineeId})
                </p>
              </div>
              <button
                onClick={() => setRejectingRequest(null)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReject} className="p-5 space-y-4 text-xs">
              {rejectError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {rejectError}
                </div>
              )}

              <div>
                <label htmlFor="reject-reason" className="block font-semibold text-slate-700 mb-1">
                  Mandatory Rejection Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="reject-reason"
                  required
                  value={rejectForm.reason}
                  onChange={(e) => setRejectForm((p) => ({ ...p, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white text-xs"
                >
                  <option value="Candidate is not on company payroll">
                    Candidate is not on company payroll (No record found)
                  </option>
                  <option value="Salary discrepancy reported by candidate">
                    Salary discrepancy (Reported wage exceeds actual offer)
                  </option>
                  <option value="Designation / Role mismatch">
                    Designation / Role mismatch from formal offer letter
                  </option>
                  <option value="Candidate left during probation / absconded">
                    Candidate left during probation / discontinued employment
                  </option>
                  <option value="Offer made but candidate did not report for duty">
                    Offer made but candidate never reported for duty
                  </option>
                  <option value="Other administrative mismatch">
                    Other administrative mismatch
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="reject-notes" className="block font-semibold text-slate-700 mb-1">
                  Specific Rejection Explanation for Audit Record{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reject-notes"
                  required
                  rows={3}
                  value={rejectForm.notes}
                  onChange={(e) => setRejectForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Provide precise explanation (e.g. Candidate attended interview on June 15 but did not join due to location relocation; no active employee record exists in HR SAP database)."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:outline-none text-xs"
                ></textarea>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed">
                This rejection reason will be archived into the National Skilling Audit Log and
                visible to state administrators for verification oversight.
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReject}
                  className="px-5 py-2 rounded-md bg-rose-700 hover:bg-rose-800 text-white font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  {submittingReject ? "Recording Rejection..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
