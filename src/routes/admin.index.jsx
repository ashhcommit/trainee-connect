import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { getTrainees, updateTraineeStatus } from "../services/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Trainee Management | Admin Panel" },
      {
        name: "description",
        content:
          "Administrator dashboard to review, approve, and reject registered trainees on the skilling outcomes platform.",
      },
      { property: "og:title", content: "Trainee Management | Admin Panel" },
      {
        property: "og:description",
        content: "Review and manage trainee registrations from the administrator dashboard.",
      },
    ],
  }),
  component: () => (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

const STATUS_LABELS = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

function AdminDashboard() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    getTrainees().then((data) => {
      if (!active) return;
      setTrainees(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      total: trainees.length,
      pending: trainees.filter((t) => t.status === "pending").length,
      approved: trainees.filter((t) => t.status === "approved").length,
      rejected: trainees.filter((t) => t.status === "rejected").length,
    }),
    [trainees],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return trainees.filter((trainee) => {
      const matchesStatus = statusFilter === "all" || trainee.status === statusFilter;
      const matchesTerm =
        !term ||
        [trainee.name, trainee.email, trainee.traineeId, trainee.district, trainee.state]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [trainees, query, statusFilter]);

  async function changeStatus(traineeId, status) {
    setBusyId(traineeId);
    const result = await updateTraineeStatus({ traineeId, status });
    setTrainees(result.trainees);
    setBusyId(null);
    setMessage(`${traineeId} marked as ${STATUS_LABELS[status].toLowerCase()}.`);
  }

  return (
    <>
      <AdminNavbar />
      <main className="page">
        <div className="page-head">
          <h1>Trainee Management</h1>
          <p className="muted">
            Review registrations submitted by trainees and record an approval decision.
          </p>
        </div>

        <div className="stat-grid">
          <div className="card stat-card">
            <span className="stat-value">{counts.total}</span>
            <span className="stat-label">Registered trainees</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">{counts.pending}</span>
            <span className="stat-label">Pending review</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">{counts.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="card stat-card">
            <span className="stat-value">{counts.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>

        {message ? (
          <p className="alert alert-success" role="status">
            {message}
          </p>
        ) : null}

        <div className="card">
          <div className="card-header">
            <h2>All trainees</h2>
            <p className="muted">Search by name, email, trainee ID, district, or state.</p>
          </div>

          <div className="toolbar">
            <input
              type="search"
              aria-label="Search trainees"
              placeholder="Search trainees..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p className="muted">Loading trainees...</p>
          ) : visible.length === 0 ? (
            <p className="muted">No trainees match your search.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Trainee ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Consent</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((trainee) => (
                    <tr key={trainee.traineeId}>
                      <td data-label="Trainee ID">{trainee.traineeId}</td>
                      <td data-label="Name">
                        <strong>{trainee.name}</strong>
                        <br />
                        <small className="muted">Registered {trainee.registeredOn}</small>
                      </td>
                      <td data-label="Contact">
                        {trainee.email}
                        <br />
                        <small className="muted">{trainee.phone}</small>
                      </td>
                      <td data-label="Location">
                        {trainee.district}, {trainee.state}
                      </td>
                      <td data-label="Consent">
                        <span className={trainee.consent ? "badge badge-yes" : "badge badge-no"}>
                          {trainee.consent ? "Given" : "Not given"}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`badge status-${trainee.status}`}>
                          {STATUS_LABELS[trainee.status]}
                        </span>
                      </td>
                      <td data-label="Action">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            disabled={busyId === trainee.traineeId || trainee.status === "approved"}
                            onClick={() => changeStatus(trainee.traineeId, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled={busyId === trainee.traineeId || trainee.status === "rejected"}
                            onClick={() => changeStatus(trainee.traineeId, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
