import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { getEmployerVerificationRequests, updateEmploymentVerification } from "../services/api";

export const Route = createFileRoute("/employer")({
  head: () => ({
    meta: [
      { title: "Employer Verification | Skilling Outcomes Platform" },
      {
        name: "description",
        content: "Review and verify employment details reported by trainees.",
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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getEmployerVerificationRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  async function reviewRequest(verificationId, status) {
    setBusyId(verificationId);
    const result = await updateEmploymentVerification({ verificationId, status });
    setRequests(result.requests);
    setBusyId(null);
    setMessage(`Employment details marked as ${status.toLowerCase()}.`);
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>Employment Verification</h1>
          <p className="muted">Review employment details reported by trainees linked to your organisation.</p>
          <p className="alert alert-demo" role="note">
            Demo mode: verification requests and employment details shown here are dummy data for
            preview purposes only.
          </p>
        </div>

        {message ? (
          <p className="alert alert-success" role="status">
            {message}
          </p>
        ) : null}

        <section className="card">
          <div className="card-header">
            <h2>Pending employment verification requests</h2>
            <p className="muted">Confirm or reject the employment information submitted by each trainee.</p>
          </div>

          {loading ? (
            <p className="muted">Loading verification requests...</p>
          ) : requests.length === 0 ? (
            <p className="muted">There are no pending verification requests.</p>
          ) : (
            <div className="verification-list">
              {requests.map((request) => (
                <article className="verification-item" key={request.verificationId}>
                  <div>
                    <p className="record-id">{request.verificationId}</p>
                    <h3>{request.traineeName}</h3>
                    <p className="muted">{request.traineeId}</p>
                  </div>
                  <dl className="verification-details">
                    <div><dt>Employer</dt><dd>{request.employer}</dd></div>
                    <div><dt>Job role</dt><dd>{request.jobRole}</dd></div>
                    <div><dt>Monthly salary</dt><dd>₹{request.salary}</dd></div>
                    <div><dt>Joined on</dt><dd>{request.joinedOn}</dd></div>
                    <div><dt>Status</dt><dd>{request.status}</dd></div>
                  </dl>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={busyId === request.verificationId || request.status !== "Pending verification"}
                      onClick={() => reviewRequest(request.verificationId, "Verified")}
                    >
                      Verify details
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={busyId === request.verificationId || request.status !== "Pending verification"}
                      onClick={() => reviewRequest(request.verificationId, "Rejected")}
                    >
                      Reject details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
