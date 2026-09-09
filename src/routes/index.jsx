import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import LoginPage from "./login";
import { getSession } from "../services/api";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === "admin") {
        navigate({ to: "/admin" });
      } else if (session.role === "employer") {
        navigate({ to: "/employer" });
      } else if (session.role === "citizen") {
        navigate({ to: "/dashboard" });
      }
    }
  }, [navigate]);

  return <LoginPage />;
}
