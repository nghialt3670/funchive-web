import { Layout, Menu } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { useSidebar } from "../../../contexts/sidebar-context";
import { useSidebarMode } from "../../../hooks/use-media-query";
import styles from "./sidebar.module.css";

const { Sider } = Layout;

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarCollapsed, isSidebarOpen, closeSidebar } = useSidebar();
  const { isOverlayMode } = useSidebarMode();

  const navItems = [
    { key: "/", label: t("dashboard") },
    { key: "/functions", label: t("functions") },
    { key: "/pipelines", label: t("pipelines") },
  ];

  const getSelectedKey = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return ["/"];
    if (currentPath.startsWith("/functions")) return ["/functions"];
    if (currentPath.startsWith("/pipelines")) return ["/pipelines"];
    return [];
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isOverlayMode) {
      closeSidebar();
    }
  };

  const handleBackdropClick = () => {
    if (isOverlayMode) {
      closeSidebar();
    }
  };

  // Determine sidebar visibility based on mode
  const isSidebarVisible = isOverlayMode ? isSidebarOpen : !isSidebarCollapsed;

  return (
    <div className={styles.sidebarContainer}>
      {/* Backdrop for overlay mode */}
      {isOverlayMode && (
        <div
          className={`${styles.backdrop} ${
            isSidebarOpen ? styles.backdropVisible : ""
          }`}
          onClick={handleBackdropClick}
        />
      )}

      <Sider
        className={styles.sidebar}
        width={256}
        collapsedWidth={0}
        collapsed={!isSidebarVisible}
        collapsible={true}
        trigger={null}
        data-sidebar
        style={{
          position: isOverlayMode ? "fixed" : "relative",
        }}
      >
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={getSelectedKey()}
          items={navItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </div>
  );
};
