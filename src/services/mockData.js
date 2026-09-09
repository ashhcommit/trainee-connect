// Mock data only. Replace with real API responses once the Express backend is ready.
// Field names follow the agreed User / Trainee contract exactly.

export const mockUser = {
  userId: "mock-user-id",
  traineeId: "mock-trainee-id",
  name: "Rahul Kumar",
  email: "rahul@example.com",
  role: "citizen",
};

export const mockAdminUser = {
  userId: "mock-admin-id",
  name: "Programme Administrator",
  email: "admin@example.com",
  role: "admin",
};

export const mockEmployerUser = {
  userId: "mock-employer-id",
  name: "Asha Industries HR",
  email: "employer@example.com",
  role: "employer",
};

export const mockTraineeProfile = {
  userId: "mock-user-id",
  traineeId: "mock-trainee-id",
  name: "Rahul Kumar",
  email: "rahul@example.com",
  role: "citizen",
  phone: "9876543210",
  district: "Kolkata",
  state: "West Bengal",
  demographicData: {},
  consent: true,
};

export const mockTrainingHistory = [
  {
    course: "Industrial Electrician",
    provider: "West Bengal Skills Centre",
    completedOn: "2026-05-18",
    status: "Completed",
  },
  {
    course: "Workplace Safety Essentials",
    provider: "West Bengal Skills Centre",
    completedOn: "2026-05-25",
    status: "Completed",
  },
];

export const mockEmploymentOutcome = {
  traineeId: "mock-trainee-id",
  employmentStatus: "Employed",
  employer: "Asha Industries",
  jobRole: "Electrical Technician",
  salary: "22000",
  joinedOn: "2026-06-10",
  verificationStatus: "Pending employer verification",
  lastUpdated: "2026-09-01",
  flagged: false,
  skillGap: "Advanced PLC maintenance",
};

export const mockFollowUps = [
  { milestone: "30-day follow-up", dueOn: "2026-07-10", status: "Completed" },
  { milestone: "90-day follow-up", dueOn: "2026-09-08", status: "Due now" },
  { milestone: "180-day follow-up", dueOn: "2026-12-07", status: "Upcoming" },
];

export const mockVerificationRequests = [
  {
    verificationId: "VER-2001",
    traineeId: "TRN-1001",
    traineeName: "Rahul Kumar",
    employer: "Asha Industries",
    jobRole: "Electrical Technician",
    salary: "22000",
    joinedOn: "2026-06-10",
    status: "Pending verification",
  },
  {
    verificationId: "VER-2002",
    traineeId: "TRN-1006",
    traineeName: "Meera Das",
    employer: "Eastern Manufacturing",
    jobRole: "Machine Operator",
    salary: "19500",
    joinedOn: "2026-07-02",
    status: "Pending verification",
  },
];

export const mockTrainees = [
  {
    traineeId: "TRN-1001",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    phone: "9876543210",
    district: "Kolkata",
    state: "West Bengal",
    consent: true,
    employmentStatus: "Employed",
    employer: "Asha Industries",
    jobRole: "Electrical Technician",
    salary: 22000,
    verificationStatus: "Pending verification",
    retentionStatus: "30 days retained",
    skillGap: "Advanced PLC maintenance",
    flagged: false,
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
    employmentStatus: "Employed",
    employer: "Rajasthan Textiles",
    jobRole: "Quality Assistant",
    salary: 24000,
    verificationStatus: "Verified",
    retentionStatus: "90 days retained",
    skillGap: "None reported",
    flagged: false,
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
    employmentStatus: "Seeking employment",
    employer: "Not reported",
    jobRole: "Not reported",
    salary: 0,
    verificationStatus: "Not applicable",
    retentionStatus: "Not applicable",
    skillGap: "Interview readiness",
    flagged: true,
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
    employmentStatus: "Employed",
    employer: "Coastal Foods",
    jobRole: "Production Associate",
    salary: 21000,
    verificationStatus: "Rejected",
    retentionStatus: "30 days retained",
    skillGap: "Workplace communication",
    flagged: true,
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
    employmentStatus: "Employed",
    employer: "Lucknow Logistics",
    jobRole: "Warehouse Associate",
    salary: 18000,
    verificationStatus: "Verified",
    retentionStatus: "180 days retained",
    skillGap: "None reported",
    flagged: false,
    registeredOn: "2026-09-01",
  },
];
