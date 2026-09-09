import { createFileRoute, redirect } from "@tanstack/react-router";

// The application opens at /login.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
