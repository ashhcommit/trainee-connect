import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import StatusBadge from "../components/StatusBadge";
import { getAdminData, getSession, useSession, switchSessionRole } from "../services/api";
import { mockCourses, mockProviders, mockCompanies } from "../services/mockData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  Filter,
  Search,
  Download,
  Award,
  Building2,
  BookOpen,
  MapPin,
  Briefcase,
  ChevronRight,
  Layers,
  ArrowUpRight,
  BarChart3,
  Flame,
  FileCheck,
  Eye,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "National Outcome Monitoring & Analytics | Admin Command Center" },
      {
        name: "description",
        content:
          "Monitor vocational placement rates, 30/90/180-day retention curves, wage growth, employer verification, and skill gap telemetry.",
      },
    ],
  }),
  component: () => (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

const SCOPE_OPTIONS = [
  { label: "Super Admin (All India National Scope)", scope: "Super Admin", target: "All India" },
  { label: "State Admin: West Bengal", scope: "State Admin", target: "West Bengal" },
  { label: "State Admin: Rajasthan", scope: "State Admin", target: "Rajasthan" },
  { label: "State Admin: Maharashtra", scope: "State Admin", target: "Maharashtra" },
  { label: "State Admin: Karnataka", scope: "State Admin", target: "Karnataka" },
  { label: "District Admin: Jaipur (Rajasthan)", scope: "District Admin", target: "Jaipur" },
  { label: "District Admin: Kolkata (West Bengal)", scope: "District Admin", target: "Kolkata" },
  { label: "District Admin: Pune (Maharashtra)", scope: "District Admin", target: "Pune" },
  { label: "District Admin: Bengaluru (Karnataka)", scope: "District Admin", target: "Bengaluru" },
  {
    label: "Programme Admin: PMKVY Digital Skills",
    scope: "Programme Admin",
    target: "PMKVY Digital",
  },
  {
    label: "Programme Admin: State Skilling Mission (WBDDM)",
    scope: "Programme Admin",
    target: "State Skilling Mission",
  },
  {
    label: "Programme Admin: DDU-GKY Rural Vocational",
    scope: "Programme Admin",
    target: "DDU-GKY Rural",
  },
];

const COLORS = ["#1a6b4f", "#12315c", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

function AdminDashboard() {
  const session = useSession();
  const [activeScope, setActiveScope] = useState(session?.scope || "Super Admin");
  const [scopeTarget, setScopeTarget] = useState(session?.scopeTarget || "All India");

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active View Tab: analytics, registry, flagged, providers
  const [activeTab, setActiveTab] = useState("analytics");

  // Filters
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedEmployment, setSelectedEmployment] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed Trainee Inspector Drawer
  const [inspectingTrainee, setInspectingTrainee] = useState(null);

  // Synchronize when role switcher changes admin session
  useEffect(() => {
    if (session?.scope && (session.scope !== activeScope || session.scopeTarget !== scopeTarget)) {
      setActiveScope(session.scope);
      setScopeTarget(session.scopeTarget || "All India");
    }
  }, [session?.scope, session?.scopeTarget]);

  async function loadScopeData(sc, target) {
    setLoading(true);
    const data = await getAdminData({ scope: sc, scopeTarget: target });
    setAdminData(data);
    setLoading(false);
  }

  useEffect(() => {
    loadScopeData(activeScope, scopeTarget);
  }, [activeScope, scopeTarget]);

  async function handleScopeChange(idx) {
    const opt = SCOPE_OPTIONS[idx];
    if (!opt) return;
    setActiveScope(opt.scope);
    setScopeTarget(opt.target);
    await switchSessionRole("admin", opt.scope);
  }

  // Trainee records filtered by multi-dimensional criteria
  const filteredTrainees = useMemo(() => {
    if (!adminData || !adminData.trainees) return [];
    return adminData.trainees.filter((t) => {
      if (selectedCourse !== "all" && t.course !== selectedCourse) return false;
      if (selectedProvider !== "all" && t.provider !== selectedProvider) return false;
      if (selectedDistrict !== "all" && t.district !== selectedDistrict) return false;
      if (selectedEmployment !== "all" && t.employmentStatus !== selectedEmployment) return false;
      if (selectedVerification !== "all" && t.verificationStatus !== selectedVerification)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.name.toLowerCase().includes(q) ||
          t.traineeId.toLowerCase().includes(q) ||
          (t.employer && t.employer.toLowerCase().includes(q)) ||
          (t.jobRole && t.jobRole.toLowerCase().includes(q)) ||
          t.district.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [
    adminData,
    selectedCourse,
    selectedProvider,
    selectedDistrict,
    selectedEmployment,
    selectedVerification,
    searchQuery,
  ]);

  // Flagged records: unverified > 30 days, or with data quality remarks
  const flaggedTrainees = useMemo(() => {
    if (!adminData || !adminData.trainees) return [];
    return adminData.trainees.filter(
      (t) =>
        t.flagged ||
        t.verificationStatus === "Rejected" ||
        (t.employmentStatus === "Employed" && t.verificationStatus === "Pending"),
    );
  }, [adminData]);

  if (loading || !adminData) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#12315c] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">
              Aggregating national outcome analytics...
            </p>
          </div>
        </div>
      </>
    );
  }

  const { kpis, analytics } = adminData;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Scope Header & Scope Selector */}
        <div className="bg-[#12315c] text-white rounded-xl p-5 sm:p-6 shadow-md border-b-4 border-[#1a6b4f] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded text-emerald-100 border border-emerald-500/30">
                National Longitudinal Telemetry
              </span>
              <span className="text-xs text-slate-300">• Live Evaluation Framework</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight">
              Skilling Outcomes &amp; Impact Monitoring Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time aggregation of training completions, verified employment outcomes,
              30/90/180-day retention curves, and curriculum skill gaps.
            </p>
          </div>

          {/* Interactive Scope Selector */}
          <div className="bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-xs min-w-[280px]">
            <label
              htmlFor="admin-scope-selector"
              className="block text-[11px] font-semibold text-slate-200 mb-1 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Administrative Governance Scope:
            </label>
            <select
              id="admin-scope-selector"
              value={SCOPE_OPTIONS.findIndex(
                (s) => s.scope === activeScope && s.target === scopeTarget,
              )}
              onChange={(e) => handleScopeChange(Number(e.target.value))}
              className="w-full bg-[#0d2445] text-white text-xs font-semibold px-2.5 py-1.5 rounded border border-white/20 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              {SCOPE_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx} className="bg-[#0d2445] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-emerald-300 mt-1 flex items-center justify-between">
              <span>Active: {activeScope}</span>
              <span className="font-bold">{scopeTarget}</span>
            </div>
          </div>
        </div>

        {/* 8 Mandatory KEY METRICS KPIS (Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* KPI 1: Total Trainees */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              Total Trainees
            </div>
            <div className="text-xl font-bold text-slate-900 mt-1">{kpis.totalTrainees}</div>
            <div className="text-[10px] text-slate-400">Enrolled &amp; tracked</div>
          </div>

          {/* KPI 2: Training Completed */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-600" />
              Completed
            </div>
            <div className="text-xl font-bold text-emerald-800 mt-1">{kpis.trainingCompleted}</div>
            <div className="text-[10px] text-emerald-700">100% certified</div>
          </div>

          {/* KPI 3: Employment Reported */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-blue-600" />
              Reported Jobs
            </div>
            <div className="text-xl font-bold text-blue-900 mt-1">{kpis.employmentReported}</div>
            <div className="text-[10px] text-blue-700">{kpis.placementRate}% gross rate</div>
          </div>

          {/* KPI 4: Employment Verified */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              HR Verified
            </div>
            <div className="text-xl font-bold text-emerald-900 mt-1">{kpis.employmentVerified}</div>
            <div className="text-[10px] text-emerald-700">Employer confirmed</div>
          </div>

          {/* KPI 5: Verified Placement Rate */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-sky-600" />
              Placement %
            </div>
            <div className="text-xl font-bold text-[#12315c] mt-1">
              {kpis.verifiedPlacementRate}%
            </div>
            <div className="text-[10px] text-slate-500">Official benchmark</div>
          </div>

          {/* KPI 6: 180-Day Retention */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              180d Retained
            </div>
            <div className="text-xl font-bold text-amber-900 mt-1">{kpis.retention180}%</div>
            <div className="text-[10px] text-amber-700">
              {kpis.retention30}% @30d • {kpis.retention90}% @90d
            </div>
          </div>

          {/* KPI 7: Average Starting Salary */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-slate-400" />
              Avg Starting
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1">
              ₹{kpis.avgStartingSalary.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-slate-400">Monthly initial wage</div>
          </div>

          {/* KPI 8: Average Current Salary */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-600" />
              Avg Current
            </div>
            <div className="text-sm font-bold text-emerald-800 mt-1">
              ₹{kpis.avgCurrentSalary.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              +{kpis.wageGrowth}% growth
            </div>
          </div>
        </div>

        {/* Tab Navigation: Analytics / Trainee Registry / Flagged / Leaderboard */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
          <button
            type="button"
            id="tab-admin-analytics"
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-[#12315c] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Impact Analytics &amp; Retention Curves
          </button>

          <button
            type="button"
            id="tab-admin-registry"
            onClick={() => setActiveTab("registry")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "registry"
                ? "bg-[#12315c] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Trainee Registry ({filteredTrainees.length})
          </button>

          <button
            type="button"
            id="tab-admin-flagged"
            onClick={() => setActiveTab("flagged")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "flagged"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-amber-800 hover:text-amber-950 border border-amber-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Audit &amp; Flagged Records ({flaggedTrainees.length})
          </button>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: ANALYTICS & RETENTION CHARTS                           */}
        {/* ============================================================== */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Chart Row 1: Retention Curve & Salary Progression */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Retention Curve Chart (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        Longitudinal Retention Curve (30, 90 &amp; 180 Days)
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Percentage of placed trainees retaining employment across milestones.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      180-Day: {kpis.retention180}%
                    </span>
                  </div>

                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.retentionCurve}>
                        <defs>
                          <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1a6b4f" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#1a6b4f" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="checkpoint" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          unit="%"
                        />
                        <Tooltip
                          formatter={(value) => [`${value}% Retention Rate`, "Retention"]}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            color: "#f8fafc",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke="#1a6b4f"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#retentionGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-[11px]">
                  {analytics.retentionCurve.map((pt) => (
                    <div key={pt.checkpoint} className="p-1 rounded bg-slate-50">
                      <span className="text-slate-400 block text-[10px]">{pt.checkpoint}</span>
                      <span className="font-bold text-slate-800">{pt.rate}%</span>
                      <span className="text-[10px] text-slate-500 block">
                        ({pt.retained} retained)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Progression Trend (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        Salary Progression Over Time
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mean monthly compensation trajectory post training.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{kpis.wageGrowth}% Growth
                    </span>
                  </div>

                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.salaryProgression}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#64748b" }}
                          tickFormatter={(v) => `₹${v / 1000}k`}
                        />
                        <Tooltip
                          formatter={(val) => [
                            `₹${Number(val).toLocaleString("en-IN")}/mo`,
                            "Avg Salary",
                          ]}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            color: "#f8fafc",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="salary" fill="#12315c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                  Starting Avg: <strong>₹{kpis.avgStartingSalary.toLocaleString("en-IN")}</strong> →
                  Current Avg: <strong>₹{kpis.avgCurrentSalary.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            {/* Chart Row 2: Placement Rate by Course & Training Provider */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Course Performance (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-sky-600" />
                      Placement Rate by Vocational Course
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Comparing total certified vs verified employment by trade.
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.coursePerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="course"
                        width={140}
                        tick={{ fontSize: 10, fill: "#334155" }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}% Placement Rate`, "Rate"]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          color: "#f8fafc",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="rate" fill="#1a6b4f" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Provider Performance (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      Training Provider Placement Ranking
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Verified employment outcomes achieved by training centre.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {analytics.providerPerformance.map((p, idx) => (
                    <div
                      key={p.provider}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="truncate max-w-[220px]">
                          {idx + 1}. {p.provider}
                        </span>
                        <span className="text-emerald-700 font-extrabold">{p.rate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${p.rate}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>
                          {p.employed} placed of {p.total} trainees
                        </span>
                        <span>{p.verified} HR verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Row 3: Skill Gaps, Attrition Reasons & Non-Placement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Skill Gaps Card */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Flame className="w-4 h-4 text-rose-600" />
                    Reported Skill Gaps &amp; Deficits
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Deficiencies flagged during follow-ups and employer verification feedback.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {analytics.skillGaps.map((sg) => (
                      <div
                        key={sg.skill}
                        className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs"
                      >
                        <div className="flex justify-between items-center font-semibold text-rose-950">
                          <span>{sg.skill}</span>
                          <span className="font-bold text-rose-700">{sg.count} trainees</span>
                        </div>
                        <div className="w-full h-1.5 bg-rose-200 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-rose-600 rounded-full"
                            style={{ width: `${Math.min(100, sg.count * 18)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                  Recommended for Sector Skill Council curriculum revision.
                </div>
              </div>

              {/* Attrition Reasons */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Reasons for Trainee Attrition
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Causes for leaving initial employer within 180 days.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {analytics.attritionReasons.map((ar) => (
                      <div
                        key={ar.reason}
                        className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 text-xs"
                      >
                        <div className="flex justify-between items-center font-semibold text-amber-950">
                          <span className="truncate max-w-[200px]">{ar.reason}</span>
                          <span className="font-bold text-amber-800">{ar.count} cases</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                  Tracked during 30/90/180-day follow-up forms.
                </div>
              </div>

              {/* Non-Placement Reasons */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Unemployment / Non-Placement Causes
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Declared by trainees currently seeking employment.
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {analytics.nonPlacementReasons.map((np) => (
                      <div
                        key={np.reason}
                        className="p-2.5 rounded-lg bg-sky-50/50 border border-sky-100 text-xs"
                      >
                        <div className="flex justify-between items-center font-semibold text-sky-950">
                          <span className="truncate max-w-[200px]">{np.reason}</span>
                          <span className="font-bold text-sky-800">{np.count} trainees</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                  Targeted for District Employment Exchange matching.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: TRAINEE REGISTRY (SEARCHABLE & FILTERABLE)             */}
        {/* ============================================================== */}
        {activeTab === "registry" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              {/* Course Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Courses</option>
                  {mockCourses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provider Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Providers</option>
                  {mockProviders.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employment Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Employment
                </label>
                <select
                  value={selectedEmployment}
                  onChange={(e) => setSelectedEmployment(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Apprentice">Apprentice</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Verification
                </label>
                <select
                  value={selectedVerification}
                  onChange={(e) => setSelectedVerification(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Districts</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              {/* Search Box */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, ID, company..."
                    className="w-full pl-7 pr-2 py-1 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Trainee Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Trainee</th>
                    <th className="py-2.5 px-3">Course &amp; Provider</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Reported Employer</th>
                    <th className="py-2.5 px-3">Salary</th>
                    <th className="py-2.5 px-3">Employment</th>
                    <th className="py-2.5 px-3">HR Verification</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTrainees.map((t) => (
                    <tr key={t.traineeId} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{t.traineeId}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{t.course}</div>
                        <div className="text-[10px] text-slate-500">{t.provider}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div>{t.district}</div>
                        <div className="text-[10px] text-slate-400">{t.state}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{t.employer}</div>
                        <div className="text-[10px] text-slate-500">{t.jobRole}</div>
                      </td>
                      <td className="py-3 px-3">
                        {t.salary > 0 ? (
                          <div className="font-bold text-emerald-700">
                            ₹{t.salary.toLocaleString("en-IN")}/mo
                          </div>
                        ) : (
                          <span className="text-slate-400">₹0 (Unemployed)</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge type="employment" value={t.employmentStatus} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge type="verification" value={t.verificationStatus} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          id={`btn-inspect-trainee-${t.traineeId}`}
                          onClick={() => setInspectingTrainee(t)}
                          className="text-xs font-semibold text-[#12315c] hover:text-[#0d2445] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-200 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: AUDIT & FLAGGED DATA QUALITY RECORDS                   */}
        {/* ============================================================== */}
        {activeTab === "flagged" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Data Quality, Anomalies &amp; Verification Exceptions
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Records requiring administrative inquiry: unverified claims &gt;30 days, rejected
                  employer claims, or delayed follow-ups.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                {flaggedTrainees.length} Records Under Review
              </span>
            </div>

            <div className="space-y-3">
              {flaggedTrainees.map((ft) => (
                <div
                  key={ft.traineeId}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{ft.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">({ft.traineeId})</span>
                      <StatusBadge type="verification" value={ft.verificationStatus} size="sm" />
                    </div>
                    <div className="text-slate-600">
                      Reported: <strong>{ft.employer}</strong> as <em>{ft.jobRole}</em> (Salary: ₹
                      {ft.salary?.toLocaleString("en-IN")})
                    </div>
                    {ft.rejectionReason && (
                      <div className="text-rose-800 font-semibold bg-rose-50 p-1.5 rounded border border-rose-200">
                        Employer Rejection: {ft.rejectionReason}
                      </div>
                    )}
                    {ft.verificationNotes && (
                      <div className="text-slate-500 italic text-[11px]">
                        Note: "{ft.verificationNotes}"
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setInspectingTrainee(ft)}
                    className="self-start md:self-center px-3 py-1.5 rounded-md bg-[#12315c] text-white font-semibold text-xs hover:bg-[#0d2445] transition-colors"
                  >
                    Open Full Audit Record
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* DRAWER / MODAL: INSPECT FULL TRAINEE LONGITUDINAL RECORD      */}
      {/* ------------------------------------------------------------- */}
      {inspectingTrainee && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#12315c] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700 px-2 py-0.5 rounded text-emerald-100">
                  Official Trainee Longitudinal Record
                </span>
                <h3 className="font-bold text-lg mt-1">{inspectingTrainee.name}</h3>
                <p className="text-xs text-slate-300 font-mono">
                  ID: {inspectingTrainee.traineeId} • District: {inspectingTrainee.district},{" "}
                  {inspectingTrainee.state}
                </p>
              </div>
              <button
                onClick={() => setInspectingTrainee(null)}
                className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Section 1: Qualification */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Vocational Qualification
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Course</span>
                    <span className="font-semibold text-slate-800">{inspectingTrainee.course}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Training Provider</span>
                    <span className="font-semibold text-slate-800">
                      {inspectingTrainee.provider}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Certification</span>
                    <span className="font-semibold text-emerald-700">
                      {inspectingTrainee.certificationStatus} (
                      {inspectingTrainee.certificateId || "N/A"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Employment Claim */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Reported Employment Outcome
                  </h4>
                  <StatusBadge type="verification" value={inspectingTrainee.verificationStatus} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Employer</span>
                    <span className="font-semibold text-slate-800">
                      {inspectingTrainee.employer}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Job Role</span>
                    <span className="font-semibold text-slate-800">
                      {inspectingTrainee.jobRole}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Starting Salary</span>
                    <span className="font-semibold text-emerald-700">
                      ₹{inspectingTrainee.salary?.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Current Salary</span>
                    <span className="font-semibold text-emerald-700">
                      ₹{inspectingTrainee.currentSalary?.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                </div>

                {inspectingTrainee.rejectionReason && (
                  <div className="mt-3 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                    <strong className="block font-semibold">Employer Rejection Audit:</strong>
                    {inspectingTrainee.rejectionReason}
                  </div>
                )}
              </div>

              {/* Section 3: Follow-Up History (30, 90, 180 Days) */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  30 / 90 / 180-Day Longitudinal Follow-Up Records
                </h4>

                <div className="space-y-2">
                  {inspectingTrainee.followUps && inspectingTrainee.followUps.length > 0 ? (
                    inspectingTrainee.followUps.map((fu) => (
                      <div
                        key={fu.milestone}
                        className="p-2.5 rounded bg-white border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{fu.title}</div>
                          <div className="text-[10px] text-slate-500">
                            Status: <span className="font-semibold">{fu.status}</span>
                            {fu.salary > 0 && ` • Wage: ₹${fu.salary.toLocaleString("en-IN")}`}
                            {fu.jobRelevant && ` • Relevance: ${fu.jobRelevant}`}
                          </div>
                        </div>
                        <StatusBadge type="followup" value={fu.status} size="sm" />
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No follow-ups logged yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingTrainee(null)}
                className="px-4 py-2 rounded-md bg-[#12315c] text-white font-semibold hover:bg-[#0d2445] text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
