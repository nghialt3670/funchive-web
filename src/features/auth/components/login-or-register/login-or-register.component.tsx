import { userManager } from "@/features/auth/lib/oidc-client.lib.ts";
import { UserAvatar } from "@/features/user/components/user-avatar";
import { Stack } from "@mui/material";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../hooks/use-auth.hook.ts";

export const LoginOrRegister = () => {
  const { t } = useTranslation("auth");
  const { user } = useAuth();

  const handleLoginClick = async () => {
    await userManager.signinRedirect();
  };

  const handleRegisterClick = async () => {
    window.location.href = `${userManager.settings.authority}/registration/email-password`;
  };

  if (!user) {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button onClick={handleLoginClick} variant="solid">
          {t("login")}
        </Button>
        <Button onClick={handleRegisterClick}>{t("register")}</Button>
      </Stack>
    );
  }

  return <UserAvatar />;
};
