import { userManager } from "@/features/auth/lib/oidc-client.lib.ts";
import type { User } from "oidc-client-ts";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userManager.getUser().then((user) => {
      setUser(user);
    });
  }, []);

  return { user };
};
