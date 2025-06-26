import { ThemeToggle } from "@/components/theme-toggle";
import { Link, Outlet, useLocation } from "react-router-dom";

import styles from "./layout.module.css";

export const Layout = () => {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      {/* App Bar - This will be constant across all pages */}
      <header className={styles.appBar}>
        <div className={styles.appBarContent}>
          <h1 className={styles.appTitle}>Funchive</h1>
          <nav className={styles.navMenu}>
            <Link
              to="/"
              className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
            >
              Home
            </Link>
            <Link
              to="/functions"
              className={`${styles.navLink} ${location.pathname === "/functions" ? styles.active : ""}`}
            >
              Functions
            </Link>
            <Link
              to="/pipelines"
              className={`${styles.navLink} ${location.pathname.startsWith("/pipelines") ? styles.active : ""}`}
            >
              Pipelines
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

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
