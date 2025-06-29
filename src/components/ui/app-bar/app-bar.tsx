import { Link, useLocation } from "react-router-dom";

import { ThemeToggle } from "../theme-toggle/theme-toggle.tsx";
import styles from "./app-bar.module.css";

export const AppBar = () => {
  const location = useLocation();

  return (
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
  );
};
