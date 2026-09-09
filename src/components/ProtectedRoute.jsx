import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSession } from "../services/api";

/**
 * Simple frontend-only route guard.
 *
 * It checks the mock session in localStorage. This is a placeholder for the
 * real authentication that the Express backend will provide later - it is not
 * a security boundary.
 */
export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const session = getSession();
    if (session) {
      setStatus("allowed");
    } else {
      setStatus("denied");
      navigate({ to: "/login" });
    }
  }, [navigate]);

  if (status !== "allowed") {
    return (
      <div className="page-center">
        <p className="muted">Checking your session...</p>
      </div>
    );
  }

  return children;
}
