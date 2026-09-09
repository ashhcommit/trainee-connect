// Unified Mock API service layer for Longitudinal Skilling Outcomes & Impact Measurement
// Designed to be swapped with Express + MongoDB REST API endpoints in future.

import { useState, useEffect } from "react";
import {
  defaultTrainee,
  mockAdminAccounts,
  mockCompanies,
  mockCourses,
  mockDistricts,
  mockEmployerAccounts,
  mockProviders,
  mockTrainees,
} from "./mockData";

export const API_BASE_URL = "http://localhost:5000";

function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SESSION_KEY = "lsoim_current_session";
const DATA_KEY = "lsoim_trainees_data";
const COMPANIES_KEY = "lsoim_companies_data";
const LOGGED_OUT_KEY = "lsoim_logged_out";

// Initialize local persistent store in browser so changes (verifications, follow-ups) persist across navigation
function loadStore(key, defaultData) {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function saveStore(key, data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save failed:", e);
  }
}

let traineesStore = loadStore(DATA_KEY, mockTrainees);
let companiesStore = loadStore(COMPANIES_KEY, mockCompanies);

// Reset store to initial state if needed
export function resetMockDatabase() {
  traineesStore = JSON.parse(JSON.stringify(mockTrainees));
  companiesStore = JSON.parse(JSON.stringify(mockCompanies));
  saveStore(DATA_KEY, traineesStore);
  saveStore(COMPANIES_KEY, companiesStore);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LOGGED_OUT_KEY);
  }
  const defaultSession = {
    userId: defaultTrainee.userId,
    traineeId: defaultTrainee.traineeId,
    name: defaultTrainee.name,
    email: defaultTrainee.email,
    role: "citizen",
  };
  setSession(defaultSession);
  return { success: true };
}

// -------------------------------------------------------------
// AUTH & SESSION HANDLING
// -------------------------------------------------------------

export function getSession() {
  if (typeof window === "undefined") {
    return {
      userId: defaultTrainee.userId,
      traineeId: defaultTrainee.traineeId,
      name: defaultTrainee.name,
      email: defaultTrainee.email,
      role: "citizen",
    };
  }
  const isLoggedOut = window.localStorage.getItem(LOGGED_OUT_KEY) === "true";
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (isLoggedOut) {
    return null;
  }
  // Default to Rahul Kumar (trainee) for immediate testing
  const initialSession = {
    userId: defaultTrainee.userId,
    traineeId: defaultTrainee.traineeId,
    name: defaultTrainee.name,
    email: defaultTrainee.email,
    role: "citizen",
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(initialSession));
  return initialSession;
}

export function setSession(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.setItem(LOGGED_OUT_KEY, "true");
  } else {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    window.localStorage.removeItem(LOGGED_OUT_KEY);
  }
  window.dispatchEvent(new CustomEvent("lsoim_session_changed", { detail: user }));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.setItem(LOGGED_OUT_KEY, "true");
  window.dispatchEvent(new CustomEvent("lsoim_session_changed", { detail: null }));
}

// React hook for real-time session updates across all components
export function useSession() {
  const [session, setSessionState] = useState(() => getSession());

  useEffect(() => {
    function handleSessionChange(e) {
      setSessionState(e?.detail !== undefined ? e.detail : getSession());
    }
    function handleStorage(e) {
      if (e.key === SESSION_KEY || e.key === LOGGED_OUT_KEY) {
        setSessionState(getSession());
      }
    }
    window.addEventListener("lsoim_session_changed", handleSessionChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("lsoim_session_changed", handleSessionChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return session;
}

// Quick role switch helper for testing all 3 roles seamlessly
export async function switchSessionRole(role, targetId) {
  await delay(80);
  if (role === "citizen" || role === "trainee") {
    const trainee =
      traineesStore.find((t) => t.traineeId === targetId || t.name === targetId) ||
      traineesStore[0];
    const session = {
      userId: trainee.userId,
      traineeId: trainee.traineeId,
      name: trainee.name,
      email: trainee.email,
      role: "citizen",
    };
    setSession(session);
    return session;
  }

  if (role === "employer") {
    const emp =
      mockEmployerAccounts.find(
        (e) => e.companyName.toLowerCase() === (targetId || "").toLowerCase(),
      ) ||
      mockEmployerAccounts.find((e) => e.companyId === targetId) ||
      mockEmployerAccounts[0];
    const session = {
      userId: emp.userId,
      name: emp.name,
      email: emp.email,
      role: "employer",
      companyName: emp.companyName,
      companyId: emp.companyId,
    };
    setSession(session);
    return session;
  }

  if (role === "admin") {
    const adm =
      mockAdminAccounts.find((a) => a.scope.toLowerCase() === (targetId || "").toLowerCase()) ||
      mockAdminAccounts.find((a) => a.userId === targetId) ||
      mockAdminAccounts[0];
    const session = {
      userId: adm.userId,
      name: adm.name,
      email: adm.email,
      role: "admin",
      scope: adm.scope,
      scopeTarget: adm.scopeTarget,
      designation: adm.designation,
    };
    setSession(session);
    return session;
  }
}

// POST /api/auth/register
export async function registerUser(data) {
  await delay(200);
  const newTraineeId = `TRN-${1000 + traineesStore.length + 1}`;
  const newTrainee = {
    userId: `USR-${1000 + traineesStore.length + 1}`,
    traineeId: newTraineeId,
    name: data.name,
    email: data.email,
    phone: data.phone || "9876500000",
    district: data.district || "Kolkata",
    state: data.state || "West Bengal",
    consent: Boolean(data.consent),
    course: data.course || mockCourses[0],
    provider: data.provider || mockProviders[0],
    trainingStatus: "Completed",
    certificationStatus: "Certified",
    certificateId: `NSDC-${Math.floor(1000 + Math.random() * 9000)}`,
    completedOn: new Date().toISOString().split("T")[0],
    programme: "PMKVY Digital Skills",
    employmentStatus: "Unemployed",
    employer: "None",
    jobRole: "None",
    salary: 0,
    currentSalary: 0,
    joinedOn: null,
    location: `${data.district || "Kolkata"}, ${data.state || "West Bengal"}`,
    skillsUsed: "",
    verificationStatus: "Not applicable",
    submittedOn: new Date().toISOString().split("T")[0],
    verificationNotes: "",
    rejectionReason: "",
    jobRelevance: "None",
    flagged: false,
    profileCompletion: 80,
    followUps: [
      {
        milestone: "30-day",
        title: "30-Day Follow-Up",
        dueOn: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        completedOn: null,
        status: "Pending",
        stillWithEmployer: null,
        currentStatus: null,
        salary: null,
        jobRelevant: null,
        feedback: null,
      },
      {
        milestone: "90-day",
        title: "90-Day Follow-Up",
        dueOn: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
        completedOn: null,
        status: "Pending",
        stillWithEmployer: null,
        currentStatus: null,
        salary: null,
        jobRelevant: null,
        feedback: null,
      },
      {
        milestone: "180-day",
        title: "180-Day Follow-Up",
        dueOn: new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0],
        completedOn: null,
        status: "Pending",
        stillWithEmployer: null,
        currentStatus: null,
        salary: null,
        jobRelevant: null,
        feedback: null,
      },
    ],
  };

  traineesStore.push(newTrainee);
  saveStore(DATA_KEY, traineesStore);

  const session = {
    userId: newTrainee.userId,
    traineeId: newTrainee.traineeId,
    name: newTrainee.name,
    email: newTrainee.email,
    role: "citizen",
  };
  setSession(session);

  return {
    success: true,
    message: "Registration successful.",
    user: session,
  };
}

// POST /api/auth/login
export async function loginUser(data) {
  await delay(150);
  const emailInput = (data?.email || "").toLowerCase().trim();
  const trainee =
    traineesStore.find(
      (t) =>
        t.email.toLowerCase() === emailInput ||
        (data?.traineeId && t.traineeId.toUpperCase() === data.traineeId.toUpperCase()),
    ) || traineesStore[0];

  const session = {
    userId: trainee.userId,
    traineeId: trainee.traineeId,
    name: trainee.name,
    email: trainee.email,
    role: "citizen",
  };
  setSession(session);
  return { success: true, user: session };
}

// POST /api/auth/admin/login
export async function loginAdmin(data) {
  await delay(150);
  const emailInput = (data?.email || "").toLowerCase().trim();
  const scopeInput = (data?.scope || "").toLowerCase().trim();

  const adminAcc =
    (scopeInput ? mockAdminAccounts.find((a) => a.scope.toLowerCase() === scopeInput) : null) ||
    mockAdminAccounts.find((a) => a.email.toLowerCase() === emailInput) ||
    mockAdminAccounts[0];

  const session = {
    userId: adminAcc.userId,
    name: adminAcc.name,
    email: adminAcc.email,
    role: "admin",
    scope: adminAcc.scope,
    scopeTarget: adminAcc.scopeTarget,
    designation: adminAcc.designation,
  };
  setSession(session);
  return { success: true, user: session };
}

// POST /api/auth/employer/login
export async function loginEmployer(data) {
  await delay(150);
  const emailInput = (data?.email || "").toLowerCase().trim();
  const companyInput = (data?.companyName || "").toLowerCase().trim();

  const empAcc =
    (companyInput
      ? mockEmployerAccounts.find((e) => e.companyName.toLowerCase() === companyInput)
      : null) ||
    mockEmployerAccounts.find((e) => e.email.toLowerCase() === emailInput) ||
    mockEmployerAccounts[0];

  const session = {
    userId: empAcc.userId,
    name: empAcc.name,
    email: empAcc.email,
    role: "employer",
    companyName: empAcc.companyName,
    companyId: empAcc.companyId,
  };
  setSession(session);
  return { success: true, user: session };
}

// POST /api/auth/logout
export async function logoutUser() {
  await delay(100);
  clearSession();
  return { success: true };
}

// -------------------------------------------------------------
// TRAINEE SERVICES
// -------------------------------------------------------------

export async function getTraineeProfile(traineeId) {
  await delay(120);
  const session = getSession();
  const idToFind = traineeId || session?.traineeId || traineesStore[0].traineeId;
  const trainee = traineesStore.find((t) => t.traineeId === idToFind) || traineesStore[0];
  return { ...trainee };
}

export async function updateTraineeProfile(data) {
  await delay(150);
  const session = getSession();
  const index = traineesStore.findIndex((t) => t.traineeId === session?.traineeId);
  if (index !== -1) {
    traineesStore[index] = {
      ...traineesStore[index],
      ...data,
      profileCompletion: Math.min(100, (traineesStore[index].profileCompletion || 80) + 10),
    };
    saveStore(DATA_KEY, traineesStore);
    if (session) {
      setSession({
        ...session,
        name: traineesStore[index].name,
        email: traineesStore[index].email,
      });
    }
    return { success: true, profile: { ...traineesStore[index] } };
  }
  return { success: false, error: "Trainee not found" };
}

export async function getTrainingHistory(traineeId) {
  await delay(100);
  const profile = await getTraineeProfile(traineeId);
  return [
    {
      course: profile.course,
      provider: profile.provider,
      completedOn: profile.completedOn,
      status: profile.trainingStatus,
      certificationStatus: profile.certificationStatus,
      certificateId: profile.certificateId,
      programme: profile.programme,
      assessmentScore: "84%",
      grade: "A (Exemplary)",
    },
    {
      course: "Workplace Readiness & Soft Skills",
      provider: profile.provider,
      completedOn: "2026-06-10",
      status: "Completed",
      certificationStatus: "Certified",
      certificateId: "NSDC-WR-2026-1049",
      programme: profile.programme,
      assessmentScore: "92%",
      grade: "A+",
    },
  ];
}

export async function getEmploymentOutcome(traineeId) {
  await delay(120);
  const profile = await getTraineeProfile(traineeId);
  return {
    traineeId: profile.traineeId,
    traineeName: profile.name,
    employmentStatus: profile.employmentStatus,
    employer: profile.employer,
    jobRole: profile.jobRole,
    salary: profile.salary,
    currentSalary: profile.currentSalary,
    joinedOn: profile.joinedOn,
    location: profile.location,
    skillsUsed: profile.skillsUsed,
    verificationStatus: profile.verificationStatus,
    submittedOn: profile.submittedOn,
    verificationNotes: profile.verificationNotes,
    rejectionReason: profile.rejectionReason,
    unemploymentReason: profile.unemploymentReason || "",
    skillGap: profile.skillGap || "",
    jobRelevance: profile.jobRelevance || "High",
    flagged: profile.flagged,
  };
}

export async function submitEmploymentOutcome(data) {
  await delay(220);
  const session = getSession();
  const index = traineesStore.findIndex((t) => t.traineeId === session?.traineeId);
  if (index !== -1) {
    const isEmployed =
      data.employmentStatus === "Employed" || data.employmentStatus === "Apprentice";
    const isSelfEmployed = data.employmentStatus === "Self-employed";

    const updated = {
      ...traineesStore[index],
      employmentStatus: data.employmentStatus,
      employer: isEmployed
        ? data.employer
        : isSelfEmployed
          ? `Self-employed (${data.jobRole || "Trade"})`
          : "None",
      jobRole: data.jobRole || (isSelfEmployed ? "Independent Practitioner" : "None"),
      salary: Number(data.salary) || 0,
      currentSalary: Number(data.salary) || 0,
      joinedOn: data.joinedOn || new Date().toISOString().split("T")[0],
      location: data.location || traineesStore[index].location,
      skillsUsed: data.skillsUsed || "",
      verificationStatus: isEmployed ? "Pending" : "Not applicable",
      submittedOn: new Date().toISOString().split("T")[0],
      verificationNotes: isEmployed
        ? `Submitted for employer verification to ${data.employer}`
        : "Self-declared outcome",
      rejectionReason: "",
      unemploymentReason: data.unemploymentReason || "",
      jobRelevance: data.jobRelevance || "High",
      flagged: false,
    };

    traineesStore[index] = updated;
    saveStore(DATA_KEY, traineesStore);
    return { success: true, outcome: updated };
  }
  return { success: false, error: "Trainee not found" };
}

export async function getFollowUps(traineeId) {
  await delay(120);
  const profile = await getTraineeProfile(traineeId);
  return profile.followUps || [];
}

export async function submitFollowUp({
  milestone,
  stillWithEmployer,
  currentStatus,
  currentSalary,
  jobRelevant,
  reasonForLeaving,
  unemploymentReason,
  feedback,
}) {
  await delay(200);
  const session = getSession();
  const index = traineesStore.findIndex((t) => t.traineeId === session?.traineeId);
  if (index !== -1) {
    const trainee = traineesStore[index];
    const followUps = (trainee.followUps || []).map((f) => {
      if (f.milestone === milestone) {
        return {
          ...f,
          completedOn: new Date().toISOString().split("T")[0],
          status: "Completed",
          stillWithEmployer: Boolean(stillWithEmployer),
          currentStatus: currentStatus || (stillWithEmployer ? "Employed" : "Unemployed"),
          salary: Number(currentSalary) || 0,
          jobRelevant: jobRelevant || "Yes",
          feedback:
            feedback ||
            reasonForLeaving ||
            unemploymentReason ||
            "Follow-up submitted successfully.",
        };
      }
      return f;
    });

    const updated = {
      ...trainee,
      followUps,
      currentSalary: Number(currentSalary) || trainee.currentSalary,
      ...(reasonForLeaving ? { attritionReason: reasonForLeaving, flagged: true } : {}),
      ...(unemploymentReason ? { unemploymentReason } : {}),
    };

    traineesStore[index] = updated;
    saveStore(DATA_KEY, traineesStore);
    return { success: true, followUps };
  }
  return { success: false, error: "Trainee not found" };
}

// -------------------------------------------------------------
// EMPLOYER SERVICES (COMPANY-SPECIFIC FILTERING)
// -------------------------------------------------------------

export async function getEmployerCompanies() {
  await delay(80);
  return companiesStore;
}

export async function getEmployerVerificationRequests(companyNameFilter) {
  await delay(180);
  const session = getSession();
  const targetCompany = companyNameFilter || session?.companyName || "ABC Technologies";

  // Filter trainees who reported working for THIS EXACT company!
  // Trainees who reported XYZ Ltd or Asha Industries will NEVER appear under ABC Technologies.
  const matchedTrainees = traineesStore.filter(
    (t) =>
      t.employer &&
      t.employer.toLowerCase().trim() === targetCompany.toLowerCase().trim() &&
      (t.employmentStatus === "Employed" || t.employmentStatus === "Apprentice"),
  );

  return matchedTrainees.map((t) => ({
    id: `VER-${t.traineeId.replace("TRN-", "")}`,
    verificationId: `VER-${t.traineeId.replace("TRN-", "")}`,
    traineeId: t.traineeId,
    traineeName: t.name,
    email: t.email,
    phone: t.phone,
    reportedEmployer: t.employer,
    employer: t.employer,
    jobRole: t.jobRole,
    reportedSalary: t.salary,
    salary: t.salary,
    currentSalary: t.currentSalary,
    joiningDate: t.joinedOn,
    joinedOn: t.joinedOn,
    location: t.location,
    skillsUsed: t.skillsUsed,
    submittedDate: t.submittedOn,
    submittedOn: t.submittedOn,
    status: t.verificationStatus, // "Pending", "Verified", "Rejected"
    verificationStatus: t.verificationStatus,
    verificationNotes: t.verificationNotes,
    rejectionReason: t.rejectionReason,
    verifiedBy: t.verifiedBy || (t.verificationStatus === "Verified" ? "HR Department" : null),
    verifiedOn: t.verifiedOn,
    employeeId: t.employeeId,
    course: t.course,
    provider: t.provider,
  }));
}

export async function verifyEmploymentRequest({ traineeId, verificationId, notes, employeeId }) {
  await delay(220);
  let idToMatch = traineeId;
  if (!idToMatch && verificationId) {
    idToMatch = `TRN-${verificationId.replace("VER-", "")}`;
  }
  const index = traineesStore.findIndex(
    (t) =>
      t.traineeId === idToMatch ||
      (verificationId && `VER-${t.traineeId.replace("TRN-", "")}` === verificationId),
  );
  if (index !== -1) {
    const verifiedNotes =
      notes ||
      (employeeId
        ? `Verified against payroll. Employee ID: ${employeeId}`
        : `Verified by employer HR on ${new Date().toISOString().split("T")[0]}`);

    traineesStore[index] = {
      ...traineesStore[index],
      verificationStatus: "Verified",
      verificationNotes: verifiedNotes,
      rejectionReason: "",
      flagged: false,
    };
    saveStore(DATA_KEY, traineesStore);
    return { success: true, trainee: traineesStore[index] };
  }
  return { success: false, error: "Record not found" };
}

export async function rejectEmploymentRequest({
  traineeId,
  verificationId,
  reason,
  rejectionReason,
  remarks,
  notes,
}) {
  await delay(220);
  let idToMatch = traineeId;
  if (!idToMatch && verificationId) {
    idToMatch = `TRN-${verificationId.replace("VER-", "")}`;
  }
  const index = traineesStore.findIndex(
    (t) =>
      t.traineeId === idToMatch ||
      (verificationId && `VER-${t.traineeId.replace("TRN-", "")}` === verificationId),
  );
  if (index !== -1) {
    const finalReason =
      reason || rejectionReason || "Employment claim could not be verified by employer.";
    const finalNotes = remarks || notes || "Claim rejected during HR payroll verification.";

    traineesStore[index] = {
      ...traineesStore[index],
      verificationStatus: "Rejected",
      rejectionReason: finalReason,
      verificationNotes: `Employer remarks: ${finalNotes}`,
      flagged: true,
    };
    saveStore(DATA_KEY, traineesStore);
    return { success: true, trainee: traineesStore[index] };
  }
  return { success: false, error: "Record not found" };
}

// -------------------------------------------------------------
// ADMIN SERVICES (ANALYTICS, MONITORING & SCOPES)
// -------------------------------------------------------------

export async function getAdminData({
  scope = "Super Admin",
  scopeTarget = "All India",
  filters = {},
} = {}) {
  await delay(200);

  // 1. Apply Scope (Super Admin vs State Admin vs District Admin vs Programme Admin)
  let filtered = [...traineesStore];

  if (scope === "State Admin" && scopeTarget && scopeTarget !== "All India") {
    filtered = filtered.filter((t) => t.state.toLowerCase() === scopeTarget.toLowerCase());
  } else if (scope === "District Admin" && scopeTarget && scopeTarget !== "All India") {
    filtered = filtered.filter((t) => t.district.toLowerCase() === scopeTarget.toLowerCase());
  } else if (scope === "Programme Admin" && scopeTarget && scopeTarget !== "All India") {
    filtered = filtered.filter((t) =>
      t.programme.toLowerCase().includes(scopeTarget.toLowerCase()),
    );
  }

  // 2. Apply dynamic dashboard filters
  if (filters.course && filters.course !== "all") {
    filtered = filtered.filter((t) => t.course === filters.course);
  }
  if (filters.provider && filters.provider !== "all") {
    filtered = filtered.filter((t) => t.provider === filters.provider);
  }
  if (filters.district && filters.district !== "all") {
    filtered = filtered.filter((t) => t.district === filters.district);
  }
  if (filters.employmentStatus && filters.employmentStatus !== "all") {
    filtered = filtered.filter((t) => t.employmentStatus === filters.employmentStatus);
  }
  if (filters.verificationStatus && filters.verificationStatus !== "all") {
    filtered = filtered.filter((t) => t.verificationStatus === filters.verificationStatus);
  }
  if (filters.flaggedOnly) {
    filtered = filtered.filter((t) => t.flagged);
  }

  // 3. Compute Key Metrics
  const totalTrainees = filtered.length;
  const trainingCompleted = filtered.filter((t) => t.trainingStatus === "Completed").length;
  const certifiedCount = filtered.filter((t) => t.certificationStatus === "Certified").length;
  const employedReported = filtered.filter(
    (t) =>
      t.employmentStatus === "Employed" ||
      t.employmentStatus === "Apprentice" ||
      t.employmentStatus === "Self-employed",
  ).length;
  const employedVerified = filtered.filter((t) => t.verificationStatus === "Verified").length;
  const placementRate =
    totalTrainees > 0 ? Math.round((employedReported / totalTrainees) * 100) : 0;
  const verifiedPlacementRate =
    totalTrainees > 0 ? Math.round((employedVerified / totalTrainees) * 100) : 0;

  // Retention rates: 30-day, 90-day, 180-day
  const traineesWith30d = filtered.filter((t) =>
    t.followUps?.some(
      (f) => f.milestone === "30-day" && f.status === "Completed" && f.stillWithEmployer,
    ),
  ).length;
  const traineesWith90d = filtered.filter((t) =>
    t.followUps?.some(
      (f) => f.milestone === "90-day" && f.status === "Completed" && f.stillWithEmployer,
    ),
  ).length;
  const traineesWith180d = filtered.filter((t) =>
    t.followUps?.some(
      (f) => f.milestone === "180-day" && f.status === "Completed" && f.stillWithEmployer,
    ),
  ).length;

  const eligibleForFollowUp = Math.max(1, employedReported);
  const retention30dRate = Math.round((traineesWith30d / eligibleForFollowUp) * 100);
  const retention90dRate = Math.round((traineesWith90d / eligibleForFollowUp) * 100);
  const retention180dRate = Math.round((traineesWith180d / eligibleForFollowUp) * 100);

  // Salary calculations
  const validStartingSalaries = filtered.filter((t) => t.salary > 0).map((t) => t.salary);
  const validCurrentSalaries = filtered
    .filter((t) => t.currentSalary > 0)
    .map((t) => t.currentSalary);

  const avgStartingSalary = validStartingSalaries.length
    ? Math.round(validStartingSalaries.reduce((a, b) => a + b, 0) / validStartingSalaries.length)
    : 0;
  const avgCurrentSalary = validCurrentSalaries.length
    ? Math.round(validCurrentSalaries.reduce((a, b) => a + b, 0) / validCurrentSalaries.length)
    : 0;

  // 4. Analytics aggregations
  // A. Placement by Course
  const courseMap = {};
  filtered.forEach((t) => {
    if (!courseMap[t.course]) {
      courseMap[t.course] = { course: t.course, total: 0, placed: 0, verified: 0 };
    }
    courseMap[t.course].total += 1;
    if (
      t.employmentStatus === "Employed" ||
      t.employmentStatus === "Apprentice" ||
      t.employmentStatus === "Self-employed"
    ) {
      courseMap[t.course].placed += 1;
    }
    if (t.verificationStatus === "Verified") {
      courseMap[t.course].verified += 1;
    }
  });
  const placementByCourse = Object.values(courseMap);

  // B. Placement by Training Provider
  const providerMap = {};
  filtered.forEach((t) => {
    if (!providerMap[t.provider]) {
      providerMap[t.provider] = { provider: t.provider, total: 0, placed: 0, verified: 0 };
    }
    providerMap[t.provider].total += 1;
    if (
      t.employmentStatus === "Employed" ||
      t.employmentStatus === "Apprentice" ||
      t.employmentStatus === "Self-employed"
    ) {
      providerMap[t.provider].placed += 1;
    }
    if (t.verificationStatus === "Verified") {
      providerMap[t.provider].verified += 1;
    }
  });
  const placementByProvider = Object.values(providerMap);

  // B. Provider Performance / Placement by Provider
  const providerPerformance = placementByProvider.map((p) => {
    const rate = p.total > 0 ? Math.round((p.placed / p.total) * 100) : 0;
    return {
      ...p,
      rate,
      placementRate: rate,
      employed: p.placed,
    };
  });

  // Course Performance
  const coursePerformance = placementByCourse.map((c) => {
    const rate = c.total > 0 ? Math.round((c.placed / c.total) * 100) : 0;
    return {
      ...c,
      rate,
      placementRate: rate,
    };
  });

  // C. Placement by District
  const districtMap = {};
  filtered.forEach((t) => {
    if (!districtMap[t.district]) {
      districtMap[t.district] = { district: t.district, state: t.state, total: 0, placed: 0 };
    }
    districtMap[t.district].total += 1;
    if (
      t.employmentStatus === "Employed" ||
      t.employmentStatus === "Apprentice" ||
      t.employmentStatus === "Self-employed"
    ) {
      districtMap[t.district].placed += 1;
    }
  });
  const placementByDistrict = Object.values(districtMap);

  // D. Retention Curve (30, 90, 180-day)
  const retentionCurve = [
    {
      checkpoint: "Initial Placement",
      milestone: "Initial Placed",
      rate: 100,
      retained: employedReported,
      trainees: employedReported,
    },
    {
      checkpoint: "30-Day Follow-Up",
      milestone: "30-Day Retained",
      rate: retention30dRate,
      retained: traineesWith30d,
      trainees: traineesWith30d,
    },
    {
      checkpoint: "90-Day Follow-Up",
      milestone: "90-Day Retained",
      rate: retention90dRate,
      retained: traineesWith90d,
      trainees: traineesWith90d,
    },
    {
      checkpoint: "180-Day Retention",
      milestone: "180-Day Retained",
      rate: retention180dRate,
      retained: traineesWith180d,
      trainees: traineesWith180d,
    },
  ];

  // E. Salary Progression
  const salaryProgression = [
    { stage: "Starting Salary", avg: avgStartingSalary, salary: avgStartingSalary },
    {
      stage: "90-Day Follow-Up",
      avg: Math.round(avgStartingSalary * 1.12) || 0,
      salary: Math.round(avgStartingSalary * 1.12) || 0,
    },
    {
      stage: "180-Day Follow-Up",
      avg: avgCurrentSalary || Math.round(avgStartingSalary * 1.25) || 0,
      salary: avgCurrentSalary || Math.round(avgStartingSalary * 1.25) || 0,
    },
  ];

  // F. Non-placement Reasons
  const nonPlacementReasons = [
    {
      reason: "Lack of local job opportunities",
      name: "Lack of local job opportunities",
      count: 4,
      value: 4,
    },
    {
      reason: "Preparing for competitive/gov exams",
      name: "Preparing for competitive/gov exams",
      count: 3,
      value: 3,
    },
    {
      reason: "Skill & curriculum mismatch",
      name: "Skill & curriculum mismatch",
      count: 2,
      value: 2,
    },
    {
      reason: "Failed practical trade re-test",
      name: "Failed practical trade re-test",
      count: 1,
      value: 1,
    },
    {
      reason: "Relocation & family constraints",
      name: "Relocation & family constraints",
      count: 2,
      value: 2,
    },
  ];

  // G. Attrition / Job Leaving Reasons
  const attritionReasons = [
    {
      reason: "Adverse physical/work conditions",
      name: "Adverse physical/work conditions",
      count: 3,
      value: 3,
    },
    {
      reason: "Compensation offer mismatch",
      name: "Compensation offer mismatch",
      count: 2,
      value: 2,
    },
    {
      reason: "Found better job opportunity",
      name: "Found better job opportunity",
      count: 3,
      value: 3,
    },
    {
      reason: "Distance & lack of transport",
      name: "Distance & lack of transport",
      count: 1,
      value: 1,
    },
    {
      reason: "Contract expiry / end of probation",
      name: "Contract expiry / end of probation",
      count: 1,
      value: 1,
    },
  ];

  // H. Job Relevance Distribution
  const jobRelevanceStats = [
    { name: "High Relevance", value: filtered.filter((t) => t.jobRelevance === "High").length },
    {
      name: "Partial Relevance",
      value: filtered.filter((t) => t.jobRelevance === "Partially").length,
    },
    {
      name: "Low / Non-relevant",
      value: filtered.filter((t) => t.jobRelevance === "Low" || t.employmentStatus === "Unemployed")
        .length,
    },
  ];

  // I. Skill Gaps reported by employers and trainees
  const skillGaps = [
    { skill: "PLC & Automation Troubleshooting", count: 5, severity: "High" },
    { skill: "3-Phase Commercial Grid Diagnostics", count: 4, severity: "High" },
    { skill: "Interview Readiness & Salary Negotiation", count: 4, severity: "Medium" },
    { skill: "Industrial Ergonomics & Physical Safety", count: 3, severity: "Medium" },
    { skill: "Full Stack End-to-End Testing (Cypress/CI)", count: 2, severity: "Low" },
  ];

  const wageGrowth =
    avgStartingSalary > 0
      ? Math.round(((avgCurrentSalary - avgStartingSalary) / avgStartingSalary) * 100)
      : 0;

  const kpisObject = {
    totalTrainees,
    trainingCompleted,
    certifiedCount,
    employedReported,
    employmentReported: employedReported,
    employedVerified,
    employmentVerified: employedVerified,
    placementRate,
    verifiedPlacementRate,
    retention30dRate,
    retention30: retention30dRate,
    retention90dRate,
    retention90: retention90dRate,
    retention180dRate,
    retention180: retention180dRate,
    avgStartingSalary,
    avgCurrentSalary,
    wageGrowth,
    flaggedCount: filtered.filter((t) => t.flagged).length,
  };

  return {
    trainees: filtered,
    metrics: kpisObject,
    kpis: kpisObject,
    analytics: {
      placementByCourse: coursePerformance,
      coursePerformance,
      placementByProvider: providerPerformance,
      providerPerformance,
      placementByDistrict,
      retentionCurve,
      salaryProgression,
      nonPlacementReasons,
      attritionReasons,
      jobRelevanceStats,
      skillGaps,
    },
  };
}

export async function toggleFlagRecord(traineeId) {
  await delay(120);
  const index = traineesStore.findIndex((t) => t.traineeId === traineeId);
  if (index !== -1) {
    traineesStore[index].flagged = !traineesStore[index].flagged;
    saveStore(DATA_KEY, traineesStore);
    return { success: true, flagged: traineesStore[index].flagged };
  }
  return { success: false };
}
