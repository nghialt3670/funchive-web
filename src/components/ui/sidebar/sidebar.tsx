import { Layout, Menu } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { useSidebar } from "../../../contexts/sidebar-context";
import { useMediaQuery } from "../../../hooks/use-media-query";
import styles from "./sidebar.module.css";

const { Sider } = Layout;

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarCollapsed, isSidebarOpen, closeSidebar } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleBackdropClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  const isSidebarVisible = isMobile ? isSidebarOpen : !isSidebarCollapsed;

  return (
    <div className={styles.sidebarContainer}>
      {isMobile && (
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
          position: isMobile ? "fixed" : "relative",
        }}
      >
        <Menu
          selectedKeys={getSelectedKey()}
          items={navItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </div>
  );
};
