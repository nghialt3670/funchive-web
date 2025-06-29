import { AppBar } from "@components/ui/app-bar";
import { Footer } from "@components/ui/footer";
import { Sidebar } from "@components/ui/sidebar";
import { Outlet } from "react-router-dom";

import { SidebarProvider } from "../../../contexts/sidebar-context";
import styles from "./root-layout.module.css";

export const RootLayout = () => {
  return (
    <SidebarProvider>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.rightContent}>
          <AppBar />
          <main className={styles.mainContent}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};
