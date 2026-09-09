import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { getAdminOutcomeRecords } from "../services/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Outcome Monitoring | Admin Panel" },
      {
        name: "description",
        content: "Monitor trainee employment outcomes, verification, retention, and skill gaps.",
      },
    ],
  }),
  component: () => (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    getAdminOutcomeRecords().then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  const metrics = useMemo(() => {
    const employed = records.filter((record) => record.employmentStatus === "Employed");
    const verified = records.filter((record) => record.verificationStatus === "Verified");
    const salaries = employed.filter((record) => record.salary > 0).map((record) => record.salary);
    return {
      trainees: records.length,
      placementRate: records.length ? Math.round((employed.length / records.length) * 100) : 0,
      verified: verified.length,
      averageSalary: salaries.length
        ? Math.round(salaries.reduce((total, salary) => total + salary, 0) / salaries.length)
        : 0,
      flagged: records.filter((record) => record.flagged).length,
    };
  }, [records]);

  const visibleRecords = useMemo(() => {
    const term = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesTerm =
        !term ||
        [record.name, record.traineeId, record.employer, record.jobRole, record.district, record.state]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesEmployment =
        employmentFilter === "all" || record.employmentStatus === employmentFilter;
      const matchesVerification =
        verificationFilter === "all" || record.verificationStatus === verificationFilter;
      return matchesTerm && matchesEmployment && matchesVerification;
    });
  }, [records, query, employmentFilter, verificationFilter]);

  return (
    <>
      <AdminNavbar />
      <main className="page">
        <div className="page-head">
          <h1>Employment Outcome Monitoring</h1>
          <p className="muted">
            Monitor placement, retention, wage progression, verification, and reported skill gaps.
          </p>
          <p className="alert alert-demo" role="note">
            Demo mode: all trainee, employment, verification, and analytics information shown here
            is dummy data for preview purposes only.
          </p>
        </div>

        <div className="stat-grid">
          <div className="card stat-card"><span className="stat-value">{metrics.trainees}</span><span className="stat-label">Trainees tracked</span></div>
          <div className="card stat-card"><span className="stat-value">{metrics.placementRate}%</span><span className="stat-label">Placement rate</span></div>
          <div className="card stat-card"><span className="stat-value">{metrics.verified}</span><span className="stat-label">Verified outcomes</span></div>
          <div className="card stat-card"><span className="stat-value">₹{metrics.averageSalary.toLocaleString()}</span><span className="stat-label">Average monthly wage</span></div>
          <div className="card stat-card"><span className="stat-value">{metrics.flagged}</span><span className="stat-label">Flagged records</span></div>
        </div>

        <section className="card">
          <div className="card-header">
            <h2>Employment outcomes</h2>
            <p className="muted">Use filters to review verified, unverified, and flagged records.</p>
          </div>
          <div className="toolbar">
            <input
              type="search"
              aria-label="Search outcome records"
              placeholder="Search trainee, employer, role, or location..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select aria-label="Filter by employment status" value={employmentFilter} onChange={(event) => setEmploymentFilter(event.target.value)}>
              <option value="all">All employment statuses</option>
              <option value="Employed">Employed</option>
              <option value="Seeking employment">Seeking employment</option>
            </select>
            <select aria-label="Filter by verification status" value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value)}>
              <option value="all">All verification statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending verification">Pending verification</option>
              <option value="Rejected">Rejected</option>
              <option value="Not applicable">Not applicable</option>
            </select>
          </div>

          {loading ? (
            <p className="muted">Loading outcome records...</p>
          ) : visibleRecords.length === 0 ? (
            <p className="muted">No records match the selected filters.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Trainee</th><th>Employment</th><th>Employer / role</th><th>Wage</th>
                    <th>Verification</th><th>Retention</th><th>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record) => (
                    <tr key={record.traineeId}>
                      <td data-label="Trainee"><strong>{record.name}</strong><br /><small className="muted">{record.traineeId}</small></td>
                      <td data-label="Employment">{record.employmentStatus}</td>
                      <td data-label="Employer / role">{record.employer}<br /><small className="muted">{record.jobRole}</small></td>
                      <td data-label="Wage">{record.salary ? `₹${record.salary.toLocaleString()}` : "Not reported"}</td>
                      <td data-label="Verification"><span className={`badge ${record.verificationStatus === "Verified" ? "badge-yes" : record.verificationStatus === "Rejected" ? "badge-no" : "status-pending"}`}>{record.verificationStatus}</span></td>
                      <td data-label="Retention">{record.retentionStatus}</td>
                      <td data-label="Review">
                        {record.flagged ? (
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelectedRecord(record)}>
                            Review flagged record
                          </button>
                        ) : <span className="muted">No flag</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedRecord ? (
          <section className="card flagged-card">
            <div className="card-header">
              <h2>Flagged record review</h2>
              <p className="muted">{selectedRecord.name} · {selectedRecord.traineeId}</p>
            </div>
            <dl className="detail-list">
              <div className="detail-row"><dt>Reported employer</dt><dd>{selectedRecord.employer}</dd></div>
              <div className="detail-row"><dt>Verification status</dt><dd>{selectedRecord.verificationStatus}</dd></div>
              <div className="detail-row"><dt>Reported skill gap</dt><dd>{selectedRecord.skillGap}</dd></div>
              <div className="detail-row"><dt>Retention status</dt><dd>{selectedRecord.retentionStatus}</dd></div>
            </dl>
            <div className="card-footer">
              <button type="button" className="btn btn-outline" onClick={() => setSelectedRecord(null)}>Close review</button>
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
