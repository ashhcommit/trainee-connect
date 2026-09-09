import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSession } from "../services/api";

/**
 * Simple frontend-only route guard.
 *
 * It checks the mock session in localStorage. This is a placeholder for the
 * real authentication that the Express backend will provide later - it is not
 * a security boundary.
 *
 * Pass `role="admin"` to restrict a page to administrator sessions.
 */
export default function ProtectedRoute({ children, role = "trainee" }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const session = getSession();
    const loginPath = role === "admin" ? "/admin/login" : "/login";

    if (session && session.role === role) {
      setStatus("allowed");
    } else {
      setStatus("denied");
      navigate({ to: loginPath });
    }
  }, [navigate, role]);

  if (status !== "allowed") {
    return (
      <div className="page-center">
        <p className="muted">Checking your session...</p>
      </div>
    );
  }

  return children;
}
