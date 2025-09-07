import { env } from "@/utils/env.ts";
import { UserManager, type UserManagerSettings } from "oidc-client-ts";

const oidcConfig: UserManagerSettings = {
  authority: env.VITE_AUTH_SERVER_URL,
  client_id: env.VITE_CLIENT_ID,
  redirect_uri: `${window.location.origin}/login/callback`,
  response_type: "code",
  scope: "openid profile",
  loadUserInfo: true,
  post_logout_redirect_uri: `${window.location.origin}/logout/callback`,
};

export const userManager = new UserManager(oidcConfig);
