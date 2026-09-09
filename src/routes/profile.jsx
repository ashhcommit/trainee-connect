import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import ProtectedRoute from "../components/ProtectedRoute";
import { getTraineeProfile, updateTraineeProfile } from "../services/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Trainee Profile | Skilling Outcomes Platform" },
      {
        name: "description",
        content: "View and update your trainee contact details, location and consent status.",
      },
      { property: "og:title", content: "My Trainee Profile | Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Keep your trainee contact details and consent status up to date.",
      },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getTraineeProfile().then((data) => setProfile(data));
  }, []);

  function startEditing() {
    setSuccessMessage("");
    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      district: profile.district,
      state: profile.state,
      consent: profile.consent,
    });
    setEditing(true);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    const result = await updateTraineeProfile(form);
    setProfile(result.profile);
    setSaving(false);
    setEditing(false);
    setSuccessMessage("Your profile has been updated.");
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>My Profile</h1>
          <p className="muted">These details identify you across all future follow-ups.</p>
        </div>

        {successMessage ? (
          <p className="alert alert-success" role="status">
            {successMessage}
          </p>
        ) : null}

        {!profile ? (
          <p className="muted">Loading your profile...</p>
        ) : editing ? (
          <section className="card card-wide">
            <div className="card-header">
              <h2>Edit profile</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="district">District</label>
                  <input
                    id="district"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="state">State</label>
                  <input id="state" name="state" value={form.state} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label className="checkbox-label" htmlFor="consent">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={handleChange}
                  />
                  <span>I consent to my outcome data being recorded and followed up.</span>
                </label>
              </div>

              <div className="button-row">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : (
          <div className="card-wide">
            <ProfileCard
              title="Personal details"
              rows={[
                { label: "Name", value: profile.name },
                { label: "Email", value: profile.email },
                { label: "Phone", value: profile.phone },
                { label: "District", value: profile.district },
                { label: "State", value: profile.state },
                {
                  label: "Consent",
                  value: (
                    <span className={profile.consent ? "badge badge-yes" : "badge badge-no"}>
                      {profile.consent ? "Given" : "Not given"}
                    </span>
                  ),
                },
              ]}
              footer={
                <button type="button" className="btn btn-primary" onClick={startEditing}>
                  Edit Profile
                </button>
              }
            />
          </div>
        )}
      </main>
    </>
  );
}
