import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { useSidebar } from "../../../contexts/sidebar-context";
import { useSidebarMode } from "../../../hooks/use-media-query";

export const SidebarToggle = () => {
  const { t } = useTranslation();
  const {
    isSidebarCollapsed,
    isSidebarOpen,
    toggleSidebarCollapse,
    toggleSidebar,
  } = useSidebar();
  const { isOverlayMode } = useSidebarMode();

  const handleToggle = () => {
    if (isOverlayMode) {
      // In overlay mode: toggle open/close
      toggleSidebar();
    } else {
      // In collapsible mode: toggle collapse/expand
      toggleSidebarCollapse();
    }
  };

  // Determine if sidebar is currently "expanded" based on mode
  const isExpanded = isOverlayMode ? isSidebarOpen : !isSidebarCollapsed;
  const tooltipText = isExpanded ? t("collapse-sidebar") : t("expand-sidebar");

  return (
    <Tooltip title={tooltipText}>
      <Button
        onClick={handleToggle}
        icon={isExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        type="default"
        data-menu-button
      />
    </Tooltip>
  );
};
