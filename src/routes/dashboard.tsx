import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import ProtectedRoute from "../components/ProtectedRoute";
import { getTraineeProfile } from "../services/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Trainee Dashboard | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "Your trainee dashboard: profile summary, employment status and training records.",
      },
      { property: "og:title", content: "Trainee Dashboard | Skilling Outcomes Platform" },
      {
        property: "og:description",
        content: "Profile summary and outcome tracking for registered trainees.",
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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTraineeProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const firstName = profile?.name ? profile.name.split(" ")[0] : "";

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <h1>{loading ? "Welcome" : `Welcome, ${firstName}`}</h1>
          <p className="muted">
            This is your trainee dashboard. Your profile stays linked to your outcomes over
            time.
          </p>
        </div>

        {loading ? (
          <p className="muted">Loading your details...</p>
        ) : (
          <div className="grid">
            <ProfileCard
              title="Profile summary"
              rows={[
                { label: "Name", value: profile.name },
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
            />

            {/* Placeholder only - the Employment Outcome module is built separately. */}
            <ProfileCard
              title="Employment Status"
              description="Not yet reported"
              rows={[]}
              footer={
                <p className="muted">
                  Employment outcomes will appear here once that module is available.
                </p>
              }
            />

            {/* Placeholder only - the Training module is built separately. */}
            <ProfileCard
              title="Training"
              description="No training records available yet"
              rows={[]}
              footer={
                <p className="muted">
                  Your completed courses will be listed here once that module is available.
                </p>
              }
            />
          </div>
        )}
      </main>
    </>
  );
}
