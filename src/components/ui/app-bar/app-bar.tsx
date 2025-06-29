import { SidebarToggle } from "../sidebar-toggle";
import { ThemeToggle } from "../theme-toggle/theme-toggle.tsx";
import styles from "./app-bar.module.css";

export const AppBar = () => {
  return (
    <header className={`${styles.appBar}`}>
      <div className={styles.appBarContent}>
        <div className={styles.leftSection}>
          <SidebarToggle />
          <h1 className={styles.appTitle}>Funchive</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};
