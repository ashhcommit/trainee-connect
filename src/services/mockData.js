// Mock data only. Replace with real API responses once the Express backend is ready.
// Field names follow the agreed User / Trainee contract exactly.

export const mockUser = {
  userId: "mock-user-id",
  traineeId: "mock-trainee-id",
  name: "Rahul Kumar",
  email: "rahul@example.com",
  role: "trainee",
};

export const mockAdminUser = {
  userId: "mock-admin-id",
  name: "Programme Administrator",
  email: "admin@example.com",
  role: "admin",
};

export const mockTraineeProfile = {
  userId: "mock-user-id",
  traineeId: "mock-trainee-id",
  name: "Rahul Kumar",
  email: "rahul@example.com",
  role: "trainee",
  phone: "9876543210",
  district: "Kolkata",
  state: "West Bengal",
  demographicData: {},
  consent: true,
};

// Trainee records shown in the admin panel.
export const mockTrainees = [
  {
    traineeId: "TRN-1001",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "9876543210",
    district: "Kolkata",
    state: "West Bengal",
    consent: true,
    status: "pending",
    registeredOn: "2026-08-12",
  },
  {
    traineeId: "TRN-1002",
    name: "Anjali Sharma",
    email: "anjali@example.com",
    phone: "9812345678",
    district: "Jaipur",
    state: "Rajasthan",
    consent: true,
    status: "approved",
    registeredOn: "2026-08-14",
  },
  {
    traineeId: "TRN-1003",
    name: "Mohammed Irfan",
    email: "irfan@example.com",
    phone: "9900112233",
    district: "Hyderabad",
    state: "Telangana",
    consent: false,
    status: "pending",
    registeredOn: "2026-08-19",
  },
  {
    traineeId: "TRN-1004",
    name: "Priya Nair",
    email: "priya@example.com",
    phone: "9745001122",
    district: "Ernakulam",
    state: "Kerala",
    consent: true,
    status: "rejected",
    registeredOn: "2026-08-21",
  },
  {
    traineeId: "TRN-1005",
    name: "Sandeep Yadav",
    email: "sandeep@example.com",
    phone: "9001122334",
    district: "Lucknow",
    state: "Uttar Pradesh",
    consent: true,
    status: "approved",
    registeredOn: "2026-09-01",
  },
];
