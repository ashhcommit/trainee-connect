import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  getEmploymentOutcome,
  getFollowUps,
  getTraineeProfile,
  getTrainingHistory,
  submitEmploymentOutcome,
} from "../services/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard | Skilling Outcomes Platform" },
      {
        name: "description",
        content: "View training history, employment outcomes, and follow-up milestones.",
      },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [editingOutcome, setEditingOutcome] = useState(false);
  const [outcomeForm, setOutcomeForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([getTraineeProfile(), getTrainingHistory(), getEmploymentOutcome(), getFollowUps()]).then(
      ([profileData, trainingData, outcomeData, followUpData]) => {
        setProfile(profileData);
        setTrainingHistory(trainingData);
        setOutcome(outcomeData);
        setFollowUps(followUpData);
      },
    );
  }, []);

  function startOutcomeEdit() {
    setMessage("");
    setOutcomeForm({ ...outcome });
    setEditingOutcome(true);
  }

  function handleOutcomeChange(event) {
    const { name, value } = event.target;
    setOutcomeForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleOutcomeSubmit(event) {
    event.preventDefault();
    setSaving(true);
    const result = await submitEmploymentOutcome(outcomeForm);
    setOutcome(result.outcome);
    setEditingOutcome(false);
    setSaving(false);
    setMessage("Employment outcome submitted for employer verification.");
  }

  const firstName = profile?.name ? profile.name.split(" ")[0] : "";

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>{profile ? `Welcome, ${firstName}` : "Citizen Dashboard"}</h1>
          <p className="muted">
            Track your training, employment outcome, and follow-up milestones in one place.
          </p>
          <p className="alert alert-demo" role="note">
            Demo mode: the profile, training, employment, and follow-up information shown here is
            dummy data for preview purposes only.
          </p>
        </div>

        {message ? (
          <p className="alert alert-success" role="status">
            {message}
          </p>
        ) : null}

        {!profile || !outcome ? (
          <p className="muted">Loading your dashboard...</p>
        ) : (
          <div className="grid">
            <ProfileCard
              title="Profile summary"
              rows={[
                { label: "Name", value: profile.name },
                { label: "District", value: profile.district },
                { label: "State", value: profile.state },
                { label: "Consent", value: profile.consent ? "Given" : "Not given" },
              ]}
            />

            <ProfileCard
              title="Training history"
              description={`${trainingHistory.length} completed records`}
              rows={trainingHistory.map((record) => ({
                label: record.course,
                value: `${record.status} · ${record.completedOn}`,
              }))}
            />

            {editingOutcome ? (
              <section className="card card-wide">
                <div className="card-header">
                  <h2>Submit employment outcome</h2>
                  <p className="muted">Update your current employment details for verification.</p>
                </div>
                <form onSubmit={handleOutcomeSubmit}>
                  <div className="field">
                    <label htmlFor="employmentStatus">Employment status</label>
                    <select
                      id="employmentStatus"
                      name="employmentStatus"
                      value={outcomeForm.employmentStatus}
                      onChange={handleOutcomeChange}
                    >
                      <option>Employed</option>
                      <option>Self-employed</option>
                      <option>Seeking employment</option>
                      <option>Not currently working</option>
                    </select>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="employer">Employer</label>
                      <input id="employer" name="employer" value={outcomeForm.employer} onChange={handleOutcomeChange} />
                    </div>
                    <div className="field">
                      <label htmlFor="jobRole">Job role</label>
                      <input id="jobRole" name="jobRole" value={outcomeForm.jobRole} onChange={handleOutcomeChange} />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="salary">Monthly salary</label>
                      <input id="salary" name="salary" type="number" value={outcomeForm.salary} onChange={handleOutcomeChange} />
                    </div>
                    <div className="field">
                      <label htmlFor="joinedOn">Joining date</label>
                      <input id="joinedOn" name="joinedOn" type="date" value={outcomeForm.joinedOn} onChange={handleOutcomeChange} />
                    </div>
                  </div>
                  <div className="button-row">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? "Submitting..." : "Submit outcome"}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditingOutcome(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            ) : (
              <ProfileCard
                title="Employment outcome"
                description={outcome.verificationStatus}
                rows={[
                  { label: "Status", value: outcome.employmentStatus },
                  { label: "Employer", value: outcome.employer },
                  { label: "Job role", value: outcome.jobRole },
                  { label: "Monthly salary", value: outcome.salary ? `₹${outcome.salary}` : "Not reported" },
                  { label: "Joined on", value: outcome.joinedOn },
                ]}
                footer={
                  <button type="button" className="btn btn-primary" onClick={startOutcomeEdit}>
                    Update employment outcome
                  </button>
                }
              />
            )}

            <ProfileCard
              title="Follow-up milestones"
              description="Complete your 30, 90, and 180-day check-ins."
              rows={followUps.map((followUp) => ({
                label: followUp.milestone,
                value: `${followUp.status} · ${followUp.dueOn}`,
              }))}
            />
          </div>
        )}
      </main>
    </>
  );
}
