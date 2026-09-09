# Trainee Authentication & Profile — Frontend Only

Builds module 1 only: login, registration, protected dashboard, and trainee profile, with all "backend" calls funnelled through a single mock API service file that your Express team can swap for real calls.

## One necessary deviation

This project runs on TanStack Router (built in, cannot be swapped for React Router). Everything else stays exactly as specified: same routes, same field names, same API contract, same folder idea. Pages live as route files instead of a `pages/` folder, and each page component is a plain React component your team can move if they re-scaffold with Vite + React Router.

Route mapping:
- `/login` → `src/routes/login.tsx`
- `/register` → `src/routes/register.tsx`
- `/dashboard` → `src/routes/dashboard.tsx`
- `/profile` → `src/routes/profile.tsx`
- `/` → redirects to `/login`

## Pages

**Login** — email + password, required-field validation with plain messages, "Register" link, mock sign-in that stores the session and goes to `/dashboard`.

**Register** — name, email, password, phone, district, state, consent checkbox. Validates all fields (valid email, consent required), then returns to `/login` with a success message.

**Dashboard** — welcome line with the trainee's first name; profile summary card (name, district, state, consent status); an "Employment Status: Not yet reported" placeholder card; a "Training: No training records available yet" placeholder card. No links to other modules.

**Profile** — read-only view of name, email, phone, district, state, consent, with an Edit Profile button that switches to an editable form. Saving goes through the service layer and shows a success message.

**Navbar** — platform name, Dashboard, Profile, Logout. Shown only on the protected pages.

## Technical details

Files to create:

```text
src/services/api.js          mock registerUser / loginUser / logoutUser /
                             getTraineeProfile / updateTraineeProfile
src/services/mockData.js     the single mock trainee record, kept separate
src/components/Navbar.jsx
src/components/ProfileCard.jsx
src/components/ProtectedRoute.jsx
src/routes/login.tsx | register.tsx | dashboard.tsx | profile.tsx
src/routes/index.tsx         redirect to /login
src/styles.css               government-style palette + shared form/card styles
```

- Field names exactly as agreed: `userId`, `traineeId`, `name`, `email`, `password`, `role`, `phone`, `district`, `state`, `demographicData`, `consent`.
- `api.js` holds each of the five contract endpoints as a commented `// TODO: replace with fetch('POST /api/auth/login', ...)` block right above the mock return, plus a shared `API_BASE_URL` constant, so replacement is a per-function edit.
- Session: a small `getSession/setSession/clearSession` helper over `localStorage`, with an explicit comment that this is a frontend placeholder and not real security; real auth arrives with the Express backend.
- `ProtectedRoute` wraps dashboard and profile, redirecting to `/login` when no mock session exists.
- No new dependencies, no state library, no backend or database of any kind.

## Design

Restrained public-sector look: deep navy header, white cards on a light neutral background, one muted accent for primary buttons, generous spacing, clear labels, strong focus states, responsive down to mobile. No gradients, animations, or decorative icons.
