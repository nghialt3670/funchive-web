import { userManager } from "@/features/auth/lib/oidc-client.lib.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    userManager
      .signoutRedirectCallback()
      .then(() => {
        console.log("Logout success");
        // Clear any remaining local state
        userManager.removeUser();
        // Redirect to home page
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Logout error", err);
        // Still clear local state and redirect on error
        userManager.removeUser();
        navigate("/", { replace: true });
      });
  }, [navigate]);

  return <p>Logging out...</p>;
};
