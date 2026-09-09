import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const API_BASE_URL = "/api";

// Helper to get token
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return {};
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  };
}

// React hook for real-time session updates
export function useSession() {
  const [session, setSessionState] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Fetch user details from our backend
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/auth/me`, { headers });
        if (res.ok) {
          const json = await res.json();
          setSessionState(json.user);
        }
      } else {
        setSessionState(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE_URL}/auth/me`, { headers });
        if (res.ok) {
          const json = await res.json();
          setSessionState(json.user);
        }
      } else {
        setSessionState(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
}

export async function registerUser(data) {
  // 1. Register in Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name
      }
    }
  });

  if (authError) {
    return { success: false, message: authError.message };
  }

  // 2. Register in Backend
  // Wait for session to be available
  const headers = await getAuthHeaders();
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        district: data.district,
        state: data.state,
        consent: data.consent,
        role: data.role || 'citizen'
      })
    });
    
    if (res.ok) {
      const json = await res.json();
      return { success: true, message: "Registration successful.", user: json.user };
    } else {
      const errorData = await res.json();
      return { success: false, message: errorData.error || "Backend registration failed" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function loginUser(data) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }
  
  // Verify with backend
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers });
  if (res.ok) {
    const json = await res.json();
    return { success: true, user: json.user };
  } else {
    return { success: false, message: 'Could not fetch user details from server' };
  }
}

export async function loginAdmin(data) {
  return loginUser(data);
}

export async function loginEmployer(data) {
  return loginUser(data);
}

export async function logoutUser() {
  await supabase.auth.signOut();
  return { success: true };
}

// Trainee Services
export async function getTraineeProfile(traineeId) {
  const headers = await getAuthHeaders();
  // Using me if no traineeId provided (not fully mapped, assuming me)
  const res = await fetch(`${API_BASE_URL}/trainees/profile`, { headers });
  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to fetch profile");
}

export async function updateTraineeProfile(data) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/trainees/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  if (res.ok) {
    const json = await res.json();
    return { success: true, profile: json.profile };
  }
  return { success: false, error: "Update failed" };
}

// Placeholders for parts not yet fully migrated, returning empty structures or dummy
export async function getTrainingHistory(traineeId) {
  return []; // Mocked in real DB
}

export async function getEmploymentOutcome(traineeId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/outcomes`, { headers });
  if (res.ok) return await res.json();
  return { employmentStatus: 'Not yet reported' };
}

export async function submitEmploymentOutcome(data) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/outcomes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (res.ok) {
    const json = await res.json();
    return { success: true, outcome: json.outcome };
  }
  return { success: false, error: "Failed to submit outcome" };
}

export async function getFollowUps(traineeId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/outcomes/followups`, { headers });
  if (res.ok) return await res.json();
  return [];
}

export async function submitFollowUp(data) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/outcomes/followups`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (res.ok) {
    const json = await res.json();
    return { success: true, followUps: [json.followUp] };
  }
  return { success: false, error: "Failed to submit followup" };
}

export async function getEmployerCompanies() {
  return []; // Placeholder
}

export async function getEmployerVerificationRequests(companyNameFilter) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/employer/verifications`, { headers });
  if (res.ok) return await res.json();
  return [];
}

export async function verifyEmploymentRequest(data) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/employer/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (res.ok) {
    const json = await res.json();
    return { success: true, trainee: json.outcome };
  }
  return { success: false, error: "Verification failed" };
}

export async function rejectEmploymentRequest(data) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/employer/reject`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (res.ok) {
    const json = await res.json();
    return { success: true, trainee: json.outcome };
  }
  return { success: false, error: "Rejection failed" };
}

export async function getAdminData(params) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/data`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params || {})
  });
  if (res.ok) {
    const json = await res.json();
    return json.data;
  }
  return { totalTrainees: 0, outcomesCount: 0 };
}

export async function switchSessionRole(role, targetId) {
  // Mock role switcher removed as we use real auth now.
  console.warn("switchSessionRole is disabled in real auth mode");
  return null;
}
