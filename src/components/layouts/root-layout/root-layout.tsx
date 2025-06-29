import { AppBar } from "@components/ui/app-bar";
import { Outlet } from "react-router-dom";

import styles from "./root-layout.module.css";

export const RootLayout = () => {
  return (
    <div className={styles.layout}>
      {/* App Bar - This will be constant across all pages */}
      <AppBar />

      {/* Main Content Area - This is where page content will be rendered */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* Footer - Also constant across pages (optional) */}
      <footer className={styles.footer}>
        <p>&copy; 2025 Funchive. All rights reserved.</p>
      </footer>
    </div>
  );
};
