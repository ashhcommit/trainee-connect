import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import StatusBadge from "../components/StatusBadge";
import {
  getTraineeProfile,
  getTrainingHistory,
  getEmploymentOutcome,
  getFollowUps,
  submitEmploymentOutcome,
  submitFollowUp,
  getSession,
  useSession,
} from "../services/api";
import { mockCompanies } from "../services/mockData";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  FileCheck,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  Info,
  MapPin,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Trainee Dashboard | National Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Track vocational certification, report employment outcomes, submit 30/90/180-day follow-ups, and review employer verification.",
      },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <ProtectedRoute role="citizen">
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const session = useSession();
  const [profile, setProfile] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Outcome submission/edit modal
  const [editingOutcome, setEditingOutcome] = useState(false);
  const [outcomeForm, setOutcomeForm] = useState({
    employmentStatus: "Employed",
    employer: "ABC Technologies",
    jobRole: "",
    salary: "",
    joinedOn: new Date().toISOString().split("T")[0],
    location: "Kolkata, West Bengal",
    skillsUsed: "",
    unemploymentReason: "",
    jobRelevance: "High",
  });
  const [submittingOutcome, setSubmittingOutcome] = useState(false);

  // Follow-up modal
  const [activeFollowUpMilestone, setActiveFollowUpMilestone] = useState(null);
  const [followUpForm, setFollowUpForm] = useState({
    milestone: "30-day",
    stillWithEmployer: true,
    currentStatus: "Employed",
    currentSalary: "",
    jobRelevant: "Yes",
    reasonForLeaving: "",
    unemploymentReason: "",
    feedback: "",
  });
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

  const [notification, setNotification] = useState("");

  async function loadData(targetId = session?.traineeId) {
    setLoading(true);
    const [profileData, trainingData, outcomeData, followUpData] = await Promise.all([
      getTraineeProfile(targetId),
      getTrainingHistory(targetId),
      getEmploymentOutcome(targetId),
      getFollowUps(targetId),
    ]);
    setProfile(profileData);
    setTrainingHistory(trainingData);
    setOutcome(outcomeData);
    setFollowUps(followUpData);
    setLoading(false);
  }

  useEffect(() => {
    loadData(session?.traineeId);
  }, [session?.traineeId]);

  function handleOpenOutcomeModal() {
    if (outcome) {
      setOutcomeForm({
        employmentStatus: outcome.employmentStatus || "Employed",
        employer:
          outcome.employer && outcome.employer !== "None" ? outcome.employer : "ABC Technologies",
        jobRole: outcome.jobRole && outcome.jobRole !== "None" ? outcome.jobRole : "",
        salary: outcome.salary || "",
        joinedOn: outcome.joinedOn || new Date().toISOString().split("T")[0],
        location: outcome.location || (profile ? `${profile.district}, ${profile.state}` : ""),
        skillsUsed: outcome.skillsUsed || "",
        unemploymentReason: outcome.unemploymentReason || "",
        jobRelevance: outcome.jobRelevance || "High",
      });
    }
    setEditingOutcome(true);
  }

  async function handleSaveOutcome(e) {
    e.preventDefault();
    setSubmittingOutcome(true);
    await submitEmploymentOutcome(outcomeForm);
    setSubmittingOutcome(false);
    setEditingOutcome(false);
    setNotification(
      "Employment outcome reported successfully. Routed to employer for verification.",
    );
    loadData();
    setTimeout(() => setNotification(""), 6000);
  }

  function handleOpenFollowUpModal(f) {
    setActiveFollowUpMilestone(f.milestone);
    setFollowUpForm({
      milestone: f.milestone,
      stillWithEmployer: f.stillWithEmployer !== null ? f.stillWithEmployer : true,
      currentStatus: f.currentStatus || "Employed",
      currentSalary: f.salary || outcome?.currentSalary || outcome?.salary || "",
      jobRelevant: f.jobRelevant || "Yes",
      reasonForLeaving: "",
      unemploymentReason: "",
      feedback: f.feedback || "",
    });
  }

  async function handleSaveFollowUp(e) {
    e.preventDefault();
    setSubmittingFollowUp(true);
    await submitFollowUp(followUpForm);
    setSubmittingFollowUp(false);
    setActiveFollowUpMilestone(null);
    setNotification(
      `${followUpForm.milestone.toUpperCase()} follow-up record recorded successfully.`,
    );
    loadData();
    setTimeout(() => setNotification(""), 6000);
  }

  if (loading || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#12315c] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading Trainee Dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  const nextFollowUp =
    followUps.find((f) => f.status === "Pending" || f.status === "Overdue") ||
    followUps[followUps.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Notification alert */}
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

        {/* Top Header & Profile Banner */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#12315c] text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                  ID: {profile.traineeId}
                </span>
                <StatusBadge type="employment" value={profile.employmentStatus} />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{profile.email}</span>
                <span>•</span>
                <span>{profile.phone}</span>
                <span>•</span>
                <span>
                  {profile.district}, {profile.state}
                </span>
              </p>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-slate-50 rounded-lg p-3 sm:p-4 border border-slate-200 min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Profile Completion
              </span>
              <span className="font-bold text-[#12315c]">{profile.profileCompletion || 95}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${profile.profileCompletion || 95}%` }}
              ></div>
            </div>
            <div className="mt-1.5 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Consent: {profile.consent ? "Granted" : "Pending"}</span>
              <span className="text-emerald-700 font-medium">Statutory Verified</span>
            </div>
          </div>
        </div>

        {/* 6 Key Status Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Training Status */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Training Status
            </div>
            <div className="font-bold text-slate-800 text-sm truncate">
              {profile.trainingStatus}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">{profile.course}</div>
          </div>

          {/* Card 2: Certification */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Certification
            </div>
            <div>
              <StatusBadge type="certification" value={profile.certificationStatus} size="sm" />
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-1 truncate">
              {profile.certificateId || "Awaiting Assessment"}
            </div>
          </div>

          {/* Card 3: Current Employment */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              Employment
            </div>
            <div>
              <StatusBadge type="employment" value={profile.employmentStatus} size="sm" />
            </div>
            <div className="text-[10px] text-slate-600 font-medium mt-1 truncate">
              {profile.jobRole || "No role reported"}
            </div>
          </div>

          {/* Card 4: Employer Verification */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              Employer Check
            </div>
            <div>
              <StatusBadge type="verification" value={profile.verificationStatus} size="sm" />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">
              {profile.employer || "None"}
            </div>
          </div>

          {/* Card 5: Follow-Up Status */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Active Milestone
            </div>
            <div>
              <StatusBadge type="followup" value={nextFollowUp?.status || "Pending"} size="sm" />
            </div>
            <div className="text-[10px] text-slate-600 font-medium mt-1 truncate">
              {nextFollowUp?.title || "180-Day"}
            </div>
          </div>

          {/* Card 6: Current Wage / Salary */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              Current Salary
            </div>
            <div className="font-bold text-[#12315c] text-sm">
              {profile.currentSalary > 0
                ? `₹${profile.currentSalary.toLocaleString("en-IN")}/mo`
                : "₹0 (Unemployed)"}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-1">
              {profile.currentSalary > profile.salary && profile.salary > 0
                ? `+₹${(profile.currentSalary - profile.salary).toLocaleString("en-IN")} growth`
                : profile.salary > 0
                  ? `Starting: ₹${profile.salary.toLocaleString("en-IN")}`
                  : "No wage history"}
            </div>
          </div>
        </div>

        {/* Visual Workflow Journey Stepper */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Longitudinal Outcome Journey Pipeline
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs relative">
            {/* Step 1 */}
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold mx-auto flex items-center justify-center text-xs mb-1">
                ✓
              </div>
              <div className="font-bold text-[11px]">1. Training</div>
              <div className="text-[10px] text-emerald-700">Completed</div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-2.5 rounded-lg border text-xs ${
                profile.employmentStatus !== "Unemployed"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-xs mb-1 ${
                  profile.employmentStatus !== "Unemployed"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-700"
                }`}
              >
                2
              </div>
              <div className="font-bold text-[11px]">2. Outcome Reported</div>
              <div className="text-[10px]">{profile.employmentStatus}</div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-2.5 rounded-lg border text-xs ${
                profile.verificationStatus === "Verified"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : profile.verificationStatus === "Rejected"
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-xs mb-1 ${
                  profile.verificationStatus === "Verified"
                    ? "bg-emerald-600 text-white"
                    : profile.verificationStatus === "Rejected"
                      ? "bg-rose-600 text-white"
                      : "bg-amber-500 text-white"
                }`}
              >
                3
              </div>
              <div className="font-bold text-[11px]">3. Employer Check</div>
              <div className="text-[10px]">{profile.verificationStatus}</div>
            </div>

            {/* Step 4 */}
            <div
              className={`p-2.5 rounded-lg border text-xs ${
                followUps[0]?.status === "Completed"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-xs mb-1 ${
                  followUps[0]?.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-700"
                }`}
              >
                4
              </div>
              <div className="font-bold text-[11px]">4. 30-Day Follow-Up</div>
              <div className="text-[10px]">{followUps[0]?.status || "Pending"}</div>
            </div>

            {/* Step 5 */}
            <div
              className={`p-2.5 rounded-lg border text-xs ${
                followUps[1]?.status === "Completed"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : followUps[1]?.status === "Overdue"
                    ? "bg-rose-50 border-rose-200 text-rose-900"
                    : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-xs mb-1 ${
                  followUps[1]?.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : followUps[1]?.status === "Overdue"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-300 text-slate-700"
                }`}
              >
                5
              </div>
              <div className="font-bold text-[11px]">5. 90-Day Follow-Up</div>
              <div className="text-[10px]">{followUps[1]?.status || "Pending"}</div>
            </div>

            {/* Step 6 */}
            <div
              className={`p-2.5 rounded-lg border text-xs ${
                followUps[2]?.status === "Completed"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full font-bold mx-auto flex items-center justify-center text-xs mb-1 ${
                  followUps[2]?.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-700"
                }`}
              >
                6
              </div>
              <div className="font-bold text-[11px]">6. 180-Day Retention</div>
              <div className="text-[10px]">{followUps[2]?.status || "Pending"}</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Section: Employment Outcome on Left, Follow-Ups on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Employment Outcome Card (Left 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#12315c]" />
                  <h2 className="font-bold text-base text-slate-900">Current Employment Outcome</h2>
                </div>
                <button
                  type="button"
                  id="btn-edit-employment-outcome"
                  onClick={handleOpenOutcomeModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#12315c] hover:text-[#0d2445] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md border border-slate-200 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {outcome?.employmentStatus === "Unemployed"
                    ? "Report Placement"
                    : "Update Outcome"}
                </button>
              </div>

              {outcome && (
                <div className="mt-4 space-y-3.5 text-sm">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 text-xs">Employment Status</span>
                    <StatusBadge type="employment" value={outcome.employmentStatus} />
                  </div>

                  {outcome.employmentStatus !== "Unemployed" ? (
                    <>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 text-xs">Reported Employer</span>
                        <span className="font-semibold text-slate-800 text-right">
                          {outcome.employer}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 text-xs">Designation / Role</span>
                        <span className="font-semibold text-slate-800 text-right">
                          {outcome.jobRole}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 text-xs">Starting Salary</span>
                        <span className="font-semibold text-emerald-700">
                          ₹{Number(outcome.salary).toLocaleString("en-IN")}/month
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 text-xs">Joining Date</span>
                        <span className="font-medium text-slate-700">{outcome.joinedOn}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 text-xs">Location</span>
                        <span className="font-medium text-slate-700">{outcome.location}</span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 text-xs">Skills Used on Job</span>
                        <span className="font-medium text-slate-700 text-right max-w-[240px] truncate">
                          {outcome.skillsUsed || "None specified"}
                        </span>
                      </div>

                      {/* Employer Verification Status Panel */}
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-slate-500" />
                            Employer Verification Status:
                          </span>
                          <StatusBadge type="verification" value={outcome.verificationStatus} />
                        </div>
                        {outcome.verificationNotes && (
                          <p className="text-xs text-slate-600 italic">
                            "{outcome.verificationNotes}"
                          </p>
                        )}
                        {outcome.rejectionReason && (
                          <div className="mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                            <strong className="block font-semibold">
                              Employer Rejection Reason:
                            </strong>
                            {outcome.rejectionReason}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                      <div className="font-semibold text-xs flex items-center gap-1.5 text-amber-900">
                        <Info className="w-4 h-4 text-amber-600" />
                        Unemployment Reason Declared:
                      </div>
                      <p className="text-xs leading-relaxed text-amber-800">
                        {outcome.unemploymentReason || "No specific reason provided."}
                      </p>
                      {outcome.skillGap && (
                        <div className="mt-2 pt-2 border-t border-amber-200 text-xs">
                          <span className="font-semibold">Reported Skill Gap:</span>{" "}
                          {outcome.skillGap}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Last updated: {outcome?.submittedOn || "2026-08-11"}</span>
              <span className="text-[#12315c] font-medium">Secured under MSDE Framework</span>
            </div>
          </div>

          {/* Column 2: 30 / 90 / 180-Day Follow-Up Milestones (Right 6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#12315c]" />
                  <h2 className="font-bold text-base text-slate-900">Follow-Up Milestone Forms</h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  30, 90 &amp; 180 Days Post-Placement
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Mandatory follow-up checkpoints track your retention with employer, salary
                progression, and the ongoing relevance of your training curriculum.
              </p>

              <div className="mt-4 space-y-3">
                {followUps.map((f) => {
                  const isCompleted = f.status === "Completed";
                  const isOverdue = f.status === "Overdue";

                  return (
                    <div
                      key={f.milestone}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isCompleted
                          ? "bg-emerald-50/40 border-emerald-200"
                          : isOverdue
                            ? "bg-rose-50/50 border-rose-200"
                            : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            {f.title}
                            <StatusBadge type="followup" value={f.status} size="sm" />
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Due Date: <span className="font-medium text-slate-700">{f.dueOn}</span>
                            {f.completedOn && (
                              <span className="ml-2 text-emerald-700">
                                • Completed on {f.completedOn}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          id={`btn-open-followup-${f.milestone}`}
                          onClick={() => handleOpenFollowUpModal(f)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                            isCompleted
                              ? "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                              : "bg-[#12315c] text-white hover:bg-[#0d2445] shadow-sm"
                          }`}
                        >
                          {isCompleted ? "View / Edit Entry" : "Submit Follow-Up"}
                        </button>
                      </div>

                      {/* Milestone details summary */}
                      {isCompleted && (
                        <div className="mt-2.5 pt-2 border-t border-emerald-100 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">
                              Employer Retention
                            </span>
                            <span className="font-semibold text-slate-800">
                              {f.stillWithEmployer ? "Retained" : "Left Employer"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">
                              Salary at Checkpoint
                            </span>
                            <span className="font-semibold text-emerald-700">
                              {f.salary > 0 ? `₹${f.salary.toLocaleString("en-IN")}` : "₹0"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">
                              Training Relevance
                            </span>
                            <span className="font-semibold text-slate-800">
                              {f.jobRelevant || "Yes"}
                            </span>
                          </div>
                        </div>
                      )}

                      {f.feedback && (
                        <p className="mt-2 text-[11px] text-slate-600 bg-white/60 p-1.5 rounded border border-slate-200 italic">
                          "{f.feedback}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Retention rate data is aggregated for program impact without sharing personal
              contacts.
            </div>
          </div>
        </div>

        {/* Training History & Assessment Records */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#12315c]" />
              <h2 className="font-bold text-base text-slate-900">
                Vocational Training &amp; Assessment History
              </h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-200">
              National Skills Qualifications Framework (NSQF)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Course / Trade</th>
                  <th className="py-2.5 px-3">Training Provider</th>
                  <th className="py-2.5 px-3">Programme</th>
                  <th className="py-2.5 px-3">Completion Date</th>
                  <th className="py-2.5 px-3">Assessment Score</th>
                  <th className="py-2.5 px-3">Certification Status</th>
                  <th className="py-2.5 px-3">Certificate ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {trainingHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.course}</td>
                    <td className="py-3 px-3">{item.provider}</td>
                    <td className="py-3 px-3 text-slate-500">{item.programme || "PMKVY"}</td>
                    <td className="py-3 px-3">{item.completedOn}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {item.assessmentScore} ({item.grade})
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge
                        type="certification"
                        value={item.certificationStatus}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {item.certificateId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: SUBMIT / UPDATE EMPLOYMENT OUTCOME */}
      {/* ------------------------------------------------------------- */}
      {editingOutcome && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#12315c] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Report Employment Outcome</h3>
                <p className="text-xs text-slate-300">
                  Provide verifiable details of your current job placement or self-employment.
                </p>
              </div>
              <button
                onClick={() => setEditingOutcome(false)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOutcome} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Option 1: Employment Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Employment Status <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Employed", "Self-employed", "Apprentice", "Unemployed"].map((status) => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => setOutcomeForm((p) => ({ ...p, employmentStatus: status }))}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        outcomeForm.employmentStatus === status
                          ? "bg-[#12315c] text-white border-[#12315c] shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Employed or Apprentice */}
              {(outcomeForm.employmentStatus === "Employed" ||
                outcomeForm.employmentStatus === "Apprentice") && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-employer"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Employer / Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="modal-employer"
                        type="text"
                        required
                        list="company-suggestions"
                        value={outcomeForm.employer}
                        onChange={(e) =>
                          setOutcomeForm((p) => ({ ...p, employer: e.target.value }))
                        }
                        placeholder="e.g. ABC Technologies"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                      <datalist id="company-suggestions">
                        {mockCompanies.map((c) => (
                          <option key={c.companyId} value={c.name} />
                        ))}
                      </datalist>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Will be routed to this company's HR portal for verification.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="modal-role"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Job Role / Designation <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="modal-role"
                        type="text"
                        required
                        value={outcomeForm.jobRole}
                        onChange={(e) => setOutcomeForm((p) => ({ ...p, jobRole: e.target.value }))}
                        placeholder="e.g. Junior Developer"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label
                        htmlFor="modal-salary"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Starting Salary (₹/month) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="modal-salary"
                        type="number"
                        required
                        min="0"
                        step="500"
                        value={outcomeForm.salary}
                        onChange={(e) => setOutcomeForm((p) => ({ ...p, salary: e.target.value }))}
                        placeholder="18000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-joinedOn"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Date of Joining <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="modal-joinedOn"
                        type="date"
                        required
                        value={outcomeForm.joinedOn}
                        onChange={(e) =>
                          setOutcomeForm((p) => ({ ...p, joinedOn: e.target.value }))
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-location"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Work Location (City/State)
                      </label>
                      <input
                        id="modal-location"
                        type="text"
                        value={outcomeForm.location}
                        onChange={(e) =>
                          setOutcomeForm((p) => ({ ...p, location: e.target.value }))
                        }
                        placeholder="e.g. Kolkata, West Bengal"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="modal-skillsUsed"
                      className="block font-semibold text-slate-700 mb-1"
                    >
                      Key Technical / Trade Skills Used on the Job
                    </label>
                    <input
                      id="modal-skillsUsed"
                      type="text"
                      value={outcomeForm.skillsUsed}
                      onChange={(e) =>
                        setOutcomeForm((p) => ({ ...p, skillsUsed: e.target.value }))
                      }
                      placeholder="e.g. React, Node.js, REST APIs, Git"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Job Relevance to Completed Training
                    </label>
                    <select
                      value={outcomeForm.jobRelevance}
                      onChange={(e) =>
                        setOutcomeForm((p) => ({ ...p, jobRelevance: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none bg-white"
                    >
                      <option value="High">High Relevance (Directly using trade skills)</option>
                      <option value="Partially">
                        Partially Relevant (General technical domain)
                      </option>
                      <option value="Low">Low / Non-Relevant (Different sector)</option>
                    </select>
                  </div>
                </>
              )}

              {/* If Self-Employed */}
              {outcomeForm.employmentStatus === "Self-employed" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="modal-trade"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Enterprise / Trade Activity
                      </label>
                      <input
                        id="modal-trade"
                        type="text"
                        required
                        value={outcomeForm.jobRole}
                        onChange={(e) => setOutcomeForm((p) => ({ ...p, jobRole: e.target.value }))}
                        placeholder="e.g. Independent Electrical Contractor"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="modal-earnings"
                        className="block font-semibold text-slate-700 mb-1"
                      >
                        Average Monthly Earnings (₹)
                      </label>
                      <input
                        id="modal-earnings"
                        type="number"
                        required
                        value={outcomeForm.salary}
                        onChange={(e) => setOutcomeForm((p) => ({ ...p, salary: e.target.value }))}
                        placeholder="20000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* If Unemployed */}
              {outcomeForm.employmentStatus === "Unemployed" && (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="modal-unemp-reason"
                      className="block font-semibold text-slate-700 mb-1"
                    >
                      Primary Reason for Unemployment <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="modal-unemp-reason"
                      value={outcomeForm.unemploymentReason}
                      onChange={(e) =>
                        setOutcomeForm((p) => ({ ...p, unemploymentReason: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none bg-white"
                    >
                      <option value="">-- Select primary reason --</option>
                      <option value="Lack of local job opportunities in renewable/tech sector">
                        Lack of local job opportunities in trade area
                      </option>
                      <option value="Preparing for state/central competitive government exams">
                        Preparing for competitive government exams
                      </option>
                      <option value="Awaiting re-assessment certification or trade exam">
                        Awaiting re-assessment certification
                      </option>
                      <option value="Wage offer was below minimum expectation / transportation cost">
                        Wage offer was below viability threshold
                      </option>
                      <option value="Family, domestic, or health constraints">
                        Family, domestic, or medical constraints
                      </option>
                      <option value="Pursuing higher formal educational degree">
                        Pursuing higher formal educational degree
                      </option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOutcome(false)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOutcome}
                  className="px-5 py-2 rounded-md bg-[#12315c] hover:bg-[#0d2445] text-white font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingOutcome ? "Saving..." : "Submit for Employer Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: 30 / 90 / 180-DAY FOLLOW-UP FORM */}
      {/* ------------------------------------------------------------- */}
      {activeFollowUpMilestone && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#12315c] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {followUpForm.milestone.toUpperCase()} Retention &amp; Progression Follow-Up
                </h3>
                <p className="text-xs text-slate-300">
                  Official outcome measurement milestone for career tracking.
                </p>
              </div>
              <button
                onClick={() => setActiveFollowUpMilestone(null)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Question 1: Still with employer? */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Are you still actively working with reported employer (
                  {outcome?.employer || "Employer"})?
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stillWithEmployer"
                      checked={followUpForm.stillWithEmployer === true}
                      onChange={() =>
                        setFollowUpForm((p) => ({
                          ...p,
                          stillWithEmployer: true,
                          currentStatus: "Employed",
                        }))
                      }
                      className="w-4 h-4 text-[#12315c]"
                    />
                    <span className="font-medium text-slate-800">Yes, still working there</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stillWithEmployer"
                      checked={followUpForm.stillWithEmployer === false}
                      onChange={() =>
                        setFollowUpForm((p) => ({
                          ...p,
                          stillWithEmployer: false,
                          currentStatus: "Unemployed",
                        }))
                      }
                      className="w-4 h-4 text-[#12315c]"
                    />
                    <span className="font-medium text-slate-800">No, I have left</span>
                  </label>
                </div>
              </div>

              {/* If Left Employer */}
              {!followUpForm.stillWithEmployer && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                  <label className="block font-semibold text-amber-900">
                    Reason for leaving previous employer <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={followUpForm.reasonForLeaving}
                    onChange={(e) =>
                      setFollowUpForm((p) => ({ ...p, reasonForLeaving: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-xs"
                  >
                    <option value="">-- Select reason for leaving --</option>
                    <option value="Found a better job with higher compensation">
                      Found better job opportunity / higher compensation
                    </option>
                    <option value="Adverse or unsafe physical working conditions">
                      Adverse or unsafe physical working conditions
                    </option>
                    <option value="Salary mismatch from initial promise / late payouts">
                      Salary mismatch from initial promise / late payouts
                    </option>
                    <option value="Relocation to hometown / family commitments">
                      Relocation to hometown / family commitments
                    </option>
                    <option value="Contract ended / probation not confirmed">
                      Contract ended / end of probation
                    </option>
                  </select>
                </div>
              )}

              {/* Question 2: Current Salary */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Monthly Salary / Earnings (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={followUpForm.currentSalary}
                  onChange={(e) =>
                    setFollowUpForm((p) => ({ ...p, currentSalary: e.target.value }))
                  }
                  placeholder="e.g. 20000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Allows tracking wage progression (e.g. Starting ₹18,000 → 90-day ₹20,000 → 180-day
                  ₹23,000)
                </p>
              </div>

              {/* Question 3: Is job relevant to training? */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Is your day-to-day job work relevant to the vocational training you received?
                </label>
                <select
                  value={followUpForm.jobRelevant}
                  onChange={(e) => setFollowUpForm((p) => ({ ...p, jobRelevant: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-xs"
                >
                  <option value="Yes">Yes, highly relevant to my course</option>
                  <option value="Partially">Partially relevant (some overlap)</option>
                  <option value="No">No, completely unrelated field</option>
                </select>
              </div>

              {/* Question 4: Additional notes / Feedback */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Trainee Feedback / Career Observations
                </label>
                <textarea
                  rows={2}
                  value={followUpForm.feedback}
                  onChange={(e) => setFollowUpForm((p) => ({ ...p, feedback: e.target.value }))}
                  placeholder="e.g. Promoted to shift supervisor; need additional training in PLC automation..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none text-xs"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveFollowUpMilestone(null)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFollowUp}
                  className="px-5 py-2 rounded-md bg-[#12315c] hover:bg-[#0d2445] text-white font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {submittingFollowUp ? "Saving..." : "Save Follow-Up Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
