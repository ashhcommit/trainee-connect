// All backend communication belongs in this service layer.
// Replace the mock returns with the agreed Express API calls when the backend is ready.

import {
  mockAdminUser,
  mockEmployerUser,
  mockEmploymentOutcome,
  mockFollowUps,
  mockTraineeProfile,
  mockTrainees,
  mockTrainingHistory,
  mockUser,
  mockVerificationRequests,
} from "./mockData";

export const API_BASE_URL = "http://localhost:5000";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Frontend placeholder only. This is not production-grade authentication.
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

// POST /api/auth/register
export async function registerUser(data) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/auth/register`, ...)
  await delay();
  return {
    success: true,
    message: "Registration successful. Please log in to continue.",
    user: {
      userId: "mock-user-id",
      traineeId: "mock-trainee-id",
      name: data.name,
      email: data.email,
      role: "citizen",
    },
  };
}

// POST /api/auth/login
export async function loginUser(data) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/auth/login`, ...)
  await delay();
  const user = { ...mockUser, email: data.email };
  setSession(user);
  return { success: true, user };
}

// POST /api/auth/admin/login
export async function loginAdmin(data) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/auth/admin/login`, ...)
  await delay();
  const user = { ...mockAdminUser, email: data.email };
  setSession(user);
  return { success: true, user };
}

// POST /api/auth/employer/login
export async function loginEmployer(data) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/auth/employer/login`, ...)
  await delay();
  const user = { ...mockEmployerUser, email: data.email };
  setSession(user);
  return { success: true, user };
}

// POST /api/auth/logout
export async function logoutUser() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/auth/logout`, ...)
  await delay(150);
  clearSession();
  return { success: true };
}

let currentProfile = { ...mockTraineeProfile };
let currentEmploymentOutcome = { ...mockEmploymentOutcome };
let currentVerificationRequests = mockVerificationRequests.map((request) => ({ ...request }));
let currentTrainees = mockTrainees.map((trainee) => ({ ...trainee }));

// GET /api/trainees/profile
export async function getTraineeProfile() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/trainees/profile`, ...)
  await delay();
  const session = getSession();
  return { ...currentProfile, email: session?.email ?? currentProfile.email };
}

// PUT /api/trainees/profile
export async function updateTraineeProfile(data) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/trainees/profile`, ...)
  await delay();
  currentProfile = { ...currentProfile, ...data };
  const session = getSession();
  if (session) setSession({ ...session, name: currentProfile.name, email: currentProfile.email });
  return { success: true, profile: { ...currentProfile } };
}

// GET /api/trainees/training-history
export async function getTrainingHistory() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/trainees/training-history`, ...)
  await delay(180);
  return mockTrainingHistory.map((record) => ({ ...record }));
}

// GET /api/trainees/employment-outcome
export async function getEmploymentOutcome() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/trainees/employment-outcome`, ...)
  await delay(180);
  return { ...currentEmploymentOutcome };
}

// PUT /api/trainees/employment-outcome
export async function submitEmploymentOutcome(data) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/trainees/employment-outcome`, ...)
  await delay(250);
  currentEmploymentOutcome = {
    ...currentEmploymentOutcome,
    ...data,
    verificationStatus: "Pending employer verification",
    lastUpdated: "2026-09-09",
  };
  return { success: true, outcome: { ...currentEmploymentOutcome } };
}

// GET /api/trainees/follow-ups
export async function getFollowUps() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/trainees/follow-ups`, ...)
  await delay(180);
  return mockFollowUps.map((followUp) => ({ ...followUp }));
}

// GET /api/employer/verification-requests
export async function getEmployerVerificationRequests() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/employer/verification-requests`, ...)
  await delay(220);
  return currentVerificationRequests.map((request) => ({ ...request }));
}

// PUT /api/employer/verification-requests/:verificationId
export async function updateEmploymentVerification({ verificationId, status }) {
  // TODO: replace with fetch(`${API_BASE_URL}/api/employer/verification-requests/${verificationId}`, ...)
  await delay(220);
  currentVerificationRequests = currentVerificationRequests.map((request) =>
    request.verificationId === verificationId ? { ...request, status } : request,
  );
  return { success: true, requests: currentVerificationRequests.map((request) => ({ ...request })) };
}

// GET /api/admin/outcomes
export async function getAdminOutcomeRecords() {
  // TODO: replace with fetch(`${API_BASE_URL}/api/admin/outcomes`, ...)
  await delay(250);
  return currentTrainees.map((trainee) => ({ ...trainee }));
}
