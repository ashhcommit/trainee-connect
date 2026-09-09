// -----------------------------------------------------------------------------
// API SERVICE LAYER
// -----------------------------------------------------------------------------
// Every call to the backend must go through this file. React components import
// these functions instead of calling fetch/axios directly.
//
// Right now each function returns mock data. To connect the real Express API,
// replace the mock block inside each function with the commented fetch call.
//
// Agreed API contract (owned by the backend team):
//   POST /api/auth/register
//   POST /api/auth/login
//   POST /api/auth/logout
//   GET  /api/trainees/profile
//   PUT  /api/trainees/profile
// -----------------------------------------------------------------------------

import { mockUser, mockTraineeProfile } from "./mockData";

export const API_BASE_URL = "http://localhost:5000";

// Small helper so the mock feels like a real network call.
function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -----------------------------------------------------------------------------
// SESSION HELPERS (frontend placeholder only)
// -----------------------------------------------------------------------------
// NOTE: storing the session in localStorage is NOT production-grade security.
// It only exists so the frontend can be demonstrated before the Express backend
// is connected. Real authentication (httpOnly cookie or token issued by the
// backend) replaces this later.

const SESSION_KEY = "lsoim_mock_session";

export function getSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

// -----------------------------------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------------------------------

// POST /api/auth/register
// data: { name, email, password, role: "trainee", phone, district, state, consent }
export async function registerUser(data) {
  // TODO: replace with the real call
  // const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error("Registration failed");
  // return response.json();

  await delay();
  return {
    success: true,
    message: "Registration successful. Please log in to continue.",
    user: {
      userId: "mock-user-id",
      traineeId: "mock-trainee-id",
      name: data.name,
      email: data.email,
      role: "trainee",
    },
  };
}

// POST /api/auth/login
// data: { email, password }
export async function loginUser(data) {
  // TODO: replace with the real call
  // const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error("Invalid email or password");
  // return response.json();

  await delay();
  const user = { ...mockUser, email: data.email };
  setSession(user);
  return { success: true, user };
}

// POST /api/auth/logout
export async function logoutUser() {
  // TODO: replace with the real call
  // await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST" });

  await delay(150);
  clearSession();
  return { success: true };
}

// -----------------------------------------------------------------------------
// TRAINEE PROFILE
// -----------------------------------------------------------------------------

// Mock store for the profile so edits persist while the app is open.
let currentProfile = { ...mockTraineeProfile };

// GET /api/trainees/profile
export async function getTraineeProfile() {
  // TODO: replace with the real call
  // const response = await fetch(`${API_BASE_URL}/api/trainees/profile`, {
  //   credentials: "include",
  // });
  // if (!response.ok) throw new Error("Could not load profile");
  // return response.json();

  await delay();
  const session = getSession();
  return { ...currentProfile, email: session?.email ?? currentProfile.email };
}

// PUT /api/trainees/profile
// data: { name, email, phone, district, state, consent }
export async function updateTraineeProfile(data) {
  // TODO: replace with the real call
  // const response = await fetch(`${API_BASE_URL}/api/trainees/profile`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   credentials: "include",
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error("Could not save profile");
  // return response.json();

  await delay();
  currentProfile = { ...currentProfile, ...data };

  // Keep the mock session in sync with the edited name/email.
  const session = getSession();
  if (session) {
    setSession({ ...session, name: currentProfile.name, email: currentProfile.email });
  }

  return { success: true, profile: { ...currentProfile } };
}
