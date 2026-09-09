# Trainee Connect

Build ONLY the frontend for the **Trainee Authentication and Trainee Profile module** of a MERN-based **Longitudinal Skilling Outcomes and Impact Measurement Platform** for an SIH project.

You are responsible ONLY for the React frontend of this module.

==================================================

1. PROJECT CONTEXT
   ==================================================

The overall platform tracks what happens to trainees after they complete skill-development training.

The complete system will eventually contain these modules:

1. User Authentication + Trainee Profile
2. Training Records
3. Employment Outcomes
4. Longitudinal Follow-ups
5. Employer Verification
6. Admin Analytics

For this task, build ONLY module 1.

Do NOT build or implement any of the other five modules.

================================================== 2. TECHNOLOGY
=============

Use:

- React
- React Router
- JavaScript
- CSS
- Component-based architecture

The backend will be a separate:

- Node.js
- Express.js
- MongoDB
- Mongoose

application developed separately by the development team.

DO NOT create the backend.

DO NOT create a database.

DO NOT use a backend-as-a-service.

================================================== 3. STRICT DATABASE OWNERSHIP
============================

IMPORTANT:

The database architecture is controlled entirely by the development team.

You must NOT design, modify, infer, or create the database architecture.

DO NOT:

- Create MongoDB collections
- Create Mongoose schemas
- Create Mongoose models
- Create database relationships
- Create database migrations
- Create database services
- Use Supabase
- Use Firebase
- Use Appwrite
- Use another backend-as-a-service
- Create a local database
- Store application data in a database
- Invent database fields
- Rename database fields
- Create alternative versions of IDs
- Assume frontend state is the database structure

The agreed database entities for the entire project are:

User
Trainee
Course
Provider
TrainingRecord
Outcome
FollowUp
Employer
Verification

For THIS module, only these User and Trainee fields are relevant:

USER:

userId
name
email
password
role

TRAINEE:

traineeId
userId
phone
district
state
demographicData
consent

Use these exact variable names.

DO NOT use alternatives such as:

studentId
candidateId
beneficiaryId
userID
trainee_id
student_id

The standard identifier is:

traineeId

================================================== 4. FIXED API CONTRACT
=====================

The backend team will implement these API endpoints separately.

The frontend must be designed to communicate with exactly these endpoints:

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET /api/trainees/profile

PUT /api/trainees/profile

DO NOT invent additional API endpoints.

DO NOT create backend route handlers.

DO NOT create Express controllers.

DO NOT create database queries.

DO NOT create MongoDB logic.

Keep all API communication isolated inside:

src/services/api.js

The React components should call functions from the API/service layer instead of making API requests directly.

For example:

api.register()
api.login()
api.logout()
api.getProfile()
api.updateProfile()

These functions may initially use mock data/placeholders.

Make it easy for the development team to replace the mock implementation with real fetch/axios calls later.

================================================== 5. REQUIRED FOLDER STRUCTURE
============================

Keep the project simple and beginner-friendly.

Use a structure similar to:

src/

├── components/
│ ├── Navbar.jsx
│ ├── ProfileCard.jsx
│ └── ProtectedRoute.jsx
│
├── pages/
│ ├── Login.jsx
│ ├── Register.jsx
│ ├── Dashboard.jsx
│ └── Profile.jsx
│
├── services/
│ └── api.js
│
├── App.jsx
├── main.jsx
└── index.css

You may adjust the structure slightly if necessary, but do not introduce unnecessary complexity.

Do NOT use Redux unless absolutely necessary.

Do NOT introduce state-management libraries.

Do NOT introduce unnecessary UI libraries.

================================================== 6. REQUIRED ROUTES
==================

Create these routes:

/login

/register

/dashboard

/profile

The application should initially open at:

/login

After a successful mock login:

/dashboard

The dashboard and profile should be treated as protected pages.

Create a simple ProtectedRoute component.

For the initial frontend-only version, authentication can be represented using simple mock/local state or localStorage.

Clearly structure this so it can later be replaced by real authentication from the Express backend.

Do NOT pretend that localStorage authentication is production-grade security.

================================================== 7. LOGIN PAGE
=============

Create a professional login page.

Fields:

- Email
- Password

Actions:

- Login button
- Link to Register

Validation:

- Email is required
- Password is required
- Display understandable validation messages

For now, use mock authentication.

After successful mock login:

Navigate to:

/dashboard

The mock logged-in user should contain fields following the agreed naming convention:

userId
traineeId
name
email
role

Example mock user:

{
userId: "mock-user-id",
traineeId: "mock-trainee-id",
name: "Rahul Kumar",
email: "[rahul@example.com](mailto:rahul@example.com)",
role: "trainee"
}

Do not hard-code database architecture anywhere else.

================================================== 8. REGISTRATION PAGE
====================

Create a registration form containing:

- Name
- Email
- Password
- Phone
- District
- State
- Consent checkbox
- Register button

Use these exact frontend field names:

name
email
password
phone
district
state
consent

The role should be:

trainee

The frontend registration payload should conceptually follow:

{
name,
email,
password,
role: "trainee",
phone,
district,
state,
consent
}

Do not create additional registration fields unless explicitly required.

Validation:

- Name required
- Valid email required
- Password required
- Phone required
- District required
- State required
- Consent must be checked

After successful mock registration:

Navigate to /login

Display a clear success message.

================================================== 9. TRAINEE DASHBOARD
====================

Create a clean trainee dashboard.

The dashboard should display:

1. Welcome section

Example:

Welcome, Rahul

2. Basic profile summary

Show:

- Name
- District
- State
- Consent status

3. Employment status placeholder

Do NOT build employment functionality.

Simply show something like:

Employment Status

"Not yet reported"

This is only a visual placeholder for the future Employment Outcome module.

4. Training summary placeholder

Do NOT build the training module.

Simply show:

Training

"No training records available yet"

This is only a visual placeholder for the future Training module.

5. Navigation

Provide:

- Dashboard
- Profile
- Logout

Do not create links to employment, training, follow-up, verification, or analytics pages.

Those modules will be developed separately by other team members.

================================================== 10. TRAINEE PROFILE PAGE
========================

Create a profile page displaying:

- Name
- Email
- Phone
- District
- State
- Consent status

Use the agreed field names:

name
email
phone
district
state
consent

Provide:

Edit Profile

button.

When editing:

Allow the trainee to modify appropriate profile information.

The frontend should eventually send:

PUT /api/trainees/profile

through:

src/services/api.js

Do not directly call the backend from the component.

After saving, display a success message and update the displayed profile.

================================================== 11. NAVBAR
==========

Create a reusable Navbar component.

Show:

- Platform name/logo
- Dashboard
- Profile
- Logout

Keep it simple.

Do not add unnecessary navigation items.

================================================== 12. API SERVICE LAYER
=====================

Create:

src/services/api.js

All backend communication must eventually happen through this file.

Create clearly named functions such as:

registerUser()
loginUser()
logoutUser()
getTraineeProfile()
updateTraineeProfile()

For now these can use mock data.

Structure them so replacing mock implementations with real API calls is straightforward.

For example, the eventual implementation should conceptually become:

loginUser(data)
↓
POST /api/auth/login

getTraineeProfile()
↓
GET /api/trainees/profile

updateTraineeProfile(data)
↓
PUT /api/trainees/profile

Do not put fetch/axios calls throughout individual React components.

================================================== 13. MOCK DATA
=============

Use only mock data necessary to demonstrate the frontend.

Use the agreed field names.

Example:

{
userId: "mock-user-id",
traineeId: "mock-trainee-id",
name: "Rahul Kumar",
email: "[rahul@example.com](mailto:rahul@example.com)",
role: "trainee",
phone: "9876543210",
district: "Kolkata",
state: "West Bengal",
demographicData: {},
consent: true
}

Clearly separate mock data from application logic.

Do not create fake Course, Outcome, FollowUp, Employer, or Verification database structures.

================================================== 14. DESIGN
==========

Create a clean, professional public-service/government-style interface appropriate for an SIH project.

Design goals:

- Professional
- Trustworthy
- Accessible
- Clean
- Responsive
- Desktop-first but mobile-friendly
- Easy to understand
- Not overly flashy

Use a restrained professional color palette.

The application should look like a serious public-sector digital platform rather than a generic startup landing page.

Use clear cards, forms, tables/sections where appropriate, consistent spacing, and readable typography.

Avoid:

- Excessive gradients
- Excessive animations
- 3D effects
- Unnecessary decorative elements
- Excessive icons
- Complex animations

================================================== 15. CODE QUALITY
================

The developers using this code are beginner/intermediate React developers.

Therefore:

- Keep components understandable
- Use meaningful variable names
- Avoid unnecessary abstraction
- Avoid overly complex hooks
- Add comments where they genuinely help
- Keep API logic separate
- Keep UI components reusable
- Avoid duplicated code where practical

Do not generate unnecessarily sophisticated architecture.

================================================== 16. IMPORTANT INTEGRATION RULE
==============================

This frontend will later be connected to a separately developed Express + MongoDB backend.

Therefore:

React UI
↓
services/api.js
↓
Express API
↓
MongoDB

The frontend must NOT communicate directly with MongoDB.

The frontend must NOT contain database logic.

The frontend must NOT define Mongoose schemas.

The frontend must NOT make assumptions about MongoDB implementation.

The frontend only knows about the agreed API contract and agreed field names.

================================================== 17. DO NOT BUILD THESE FEATURES
===============================

Do NOT build:

- Training management
- Employment submission
- Job recommendations
- Job portal
- Follow-up system
- Employer dashboard
- Employer verification
- Admin dashboard
- Analytics
- AI chatbot
- AI prediction
- Resume builder
- Notifications system
- Payments
- Aadhaar integration
- DigiLocker integration
- Blockchain
- Facial recognition
- Video calls
- Complex role-management system
- Any feature not required for this module

Only build:

AUTHENTICATION FRONTEND +
TRAINEE PROFILE FRONTEND

================================================== 18. FINAL REQUIREMENT
=====================

Before finishing, make sure:

- React application runs correctly
- Routes work
- Login page works with mock authentication
- Registration page works with mock registration
- Dashboard works
- Profile page works
- Logout works
- ProtectedRoute works for the frontend mock session
- API/service layer exists
- Mock API functions are isolated
- Exact variable names are used
- No backend/database service has been introduced
- No unnecessary dependencies have been added
- No other project modules have been implemented

The resulting code must be exportable and easy for the development team to continue developing in VS Code and GitHub.

Do not make architectural decisions about the backend or MongoDB.

The development team owns the database schema, backend architecture, and API implementation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/08e05ebb-cc35-44bf-b755-e44c31676cda).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
