import { LoginOrRegister } from "@/features/auth/components/login-or-register";
import { Stack } from "@mui/material";

import { AppName } from "../app-name";
import { SidebarToggle } from "../sidebar-toggle";
import styles from "./app-bar.module.css";

export const AppBar = () => {
  return (
    <header className={styles.appBarContainer}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX={1}
        paddingY={0.5}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={1}
        >
          <SidebarToggle />
          <AppName />
        </Stack>
        <LoginOrRegister />
      </Stack>
    </header>
  );
};
