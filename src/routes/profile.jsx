import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import StatusBadge from "../components/StatusBadge";
import { getTraineeProfile, updateTraineeProfile, useSession } from "../services/api";
import {
  User,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Save,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Trainee Profile & Consent | Skilling Outcomes Platform" },
      {
        name: "description",
        content:
          "View and update your trainee contact details, location and longitudinal consent status.",
      },
    ],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <ProtectedRoute role="citizen">
      <Profile />
    </ProtectedRoute>
  );
}

function Profile() {
  const session = useSession();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getTraineeProfile(session?.traineeId).then((data) => {
      setProfile(data);
      setForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        district: data.district,
        state: data.state,
        consent: data.consent,
      });
    });
  }, [session?.traineeId]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const result = await updateTraineeProfile(form);
    const updatedData = result?.profile || result;
    setProfile(updatedData);
    setSaving(false);
    setEditing(false);
    setSuccessMessage("Profile and longitudinal tracking consent saved successfully.");
    setTimeout(() => setSuccessMessage(""), 5000);
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#12315c] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Loading profile records...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {successMessage && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#12315c] text-white font-bold text-lg flex items-center justify-center">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
                <p className="text-xs text-slate-500 font-mono">Trainee ID: {profile.traineeId}</p>
              </div>
            </div>

            {!editing ? (
              <button
                type="button"
                id="btn-edit-profile"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#12315c] bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-md border border-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Contact &amp; Consent
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
              >
                Cancel
              </button>
            )}
          </div>

          {!editing ? (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block mb-1">Email Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {profile.email}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block mb-1">Mobile Phone Number</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {profile.phone}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block mb-1">District</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.district}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block mb-1">State</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.state}
                  </span>
                </div>
              </div>

              {/* Training Qualification Record */}
              <div className="p-4 rounded-lg bg-sky-50 border border-sky-100 text-xs mt-4">
                <div className="font-bold text-sky-950 flex items-center gap-1.5 mb-2">
                  <GraduationCap className="w-4 h-4 text-sky-700" />
                  Primary Vocational Qualification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-sky-800 block text-[10px]">Course</span>
                    <span className="font-semibold text-slate-800">{profile.course}</span>
                  </div>
                  <div>
                    <span className="text-sky-800 block text-[10px]">Training Centre</span>
                    <span className="font-semibold text-slate-800">{profile.provider}</span>
                  </div>
                  <div>
                    <span className="text-sky-800 block text-[10px]">Status &amp; Certificate</span>
                    <span className="font-semibold text-slate-800">
                      {profile.certificationStatus} ({profile.certificateId || "N/A"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Consent Card */}
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Statutory Consent for Longitudinal Tracking:{" "}
                  <span className="font-extrabold uppercase">
                    {profile.consent ? "Granted" : "Withheld"}
                  </span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  Consent authorizes MSDE to monitor your 30, 90, and 180-day employment retention
                  and aggregate outcome data without publicly exposing personally identifiable
                  details.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#12315c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300"
                  />
                  <span>
                    <strong className="text-emerald-900 block font-semibold mb-0.5">
                      Statutory Consent for Longitudinal Outcome Tracking
                    </strong>
                    I grant consent to MSDE and authorized state skilling missions to track
                    employment outcomes and verification status.
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-[#12315c] hover:bg-[#0d2445] text-white font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
