import { userManager } from "@/features/auth/lib/oidc-client.lib.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoginCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then((user) => {
        console.log("Login success", user);
        // 👇 Redirect after success
        navigate("/");
      })
      .catch((err) => {
        console.error("Login error", err);
        navigate("/login");
      });
  }, [navigate]);

  return <p>Logging in...</p>;
};
