import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { useSidebar } from "../../../contexts/sidebar-context";
import { useMediaQuery } from "../../../hooks/use-media-query";

export const SidebarToggle = () => {
  const { t } = useTranslation();
  const {
    isSidebarCollapsed,
    isSidebarOpen,
    toggleSidebarCollapse,
    toggleSidebar,
  } = useSidebar();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggle = () => {
    if (isMobile) {
      toggleSidebar();
    } else {
      toggleSidebarCollapse();
    }
  };

  const isExpanded = isMobile ? isSidebarOpen : !isSidebarCollapsed;
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
