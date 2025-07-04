import { getAntdLocale } from "@/lib/antd-locale.ts";
import { ConfigProvider } from "antd";
import type { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

export const AntdConfigProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const locale = getAntdLocale(i18n.language);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 4,
          colorText: "var(--color-text-primary)",
          colorTextSecondary: "var(--color-text-secondary)",
          colorTextTertiary: "var(--color-text-tertiary)",
          colorBorder: "var(--color-border)",
          colorBorderSecondary: "var(--color-border)",
          colorFillSecondary: "var(--color-background-secondary)",
          colorBgContainer: "var(--color-background-primary)",
        },
        components: {
          Tag: {
            colorBgContainer: "var(--color-background-primary)",
            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",
            colorFillSecondary: "var(--color-background-secondary)",
            colorFillTertiary: "var(--color-background-tertiary)",
            colorFillQuaternary: "var(--color-background-quaternary)",
            colorBgBase: "var(--color-background-primary)",
            colorBgElevated: "var(--color-background-primary)",
            colorBgLayout: "var(--color-background-primary)",
            colorBgMask: "var(--color-background-primary)",
            colorBgSpotlight: "var(--color-background-primary)",
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
            defaultColor: "var(--color-text-secondary)",
            defaultBg: "var(--color-background-secondary)",
            colorSuccess: "var(--color-success)",
            colorWarning: "var(--color-warning)",
            colorError: "var(--color-error)",
            colorInfo: "var(--color-info)",
          },
          Card: {
            colorBgContainer: "var(--color-background-secondary)",
            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",
            colorFillSecondary: "var(--color-background-secondary)",
            colorFillTertiary: "var(--color-background-tertiary)",
            colorFillQuaternary: "var(--color-background-quaternary)",
          },
          Typography: {
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
          },
          Input: {
            colorText: "var(--color-text-primary)",
            colorTextPlaceholder: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            activeBorderColor: "var(--color-border-focus)",
            hoverBorderColor: "var(--color-border-hover)",
            activeShadow: "none",
            controlOutline: "none",
          },
          InputNumber: {
            colorText: "var(--color-text-primary)",
            colorTextPlaceholder: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            activeBorderColor: "var(--color-border-focus)",
            hoverBorderColor: "var(--color-border-hover)",
            controlOutline: "none",
          },
          Select: {
            colorText: "var(--color-text-primary)",
            colorTextPlaceholder: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            activeBorderColor: "var(--color-border-focus)",
            hoverBorderColor: "var(--color-border-hover)",
            optionSelectedBg: "var(--color-background-selected)",
            controlItemBgHover: "var(--color-background-hover)",
            colorBgBlur: "var(--color-background-primary)",
            colorBgContainer: "var(--color-background-primary)",
            colorBgElevated: "var(--color-background-primary)",
            colorBgBase: "var(--color-background-primary)",
            colorBgLayout: "var(--color-background-primary)",
            colorBgMask: "var(--color-background-primary)",
            colorBgSpotlight: "var(--color-background-primary)",
            controlOutline: "none",
          },
          Button: {
            colorText: "var(--color-text-primary)",
            colorBorder: "var(--color-border)",
            controlOutline: "none",
          },
          Popover: {
            colorBgElevated: "var(--color-background-primary)",
          },
          Dropdown: {
            colorBgElevated: "var(--color-background-primary)",
            colorBgContainer: "var(--color-background-secondary)",
            colorBgBase: "var(--color-background-secondary)",
            colorBgLayout: "var(--color-background-secondary)",
            colorBgSpotlight: "var(--color-background-secondary)",
            colorBorder: "var(--color-border)",
            colorFillSecondary: "var(--color-background-secondary)",
            colorFillTertiary: "var(--color-background-tertiary)",
            colorFillQuaternary: "var(--color-background-quaternary)",
          },
          Modal: {
            colorBgElevated: "var(--color-background-primary)",
          },
          Drawer: {
            colorBgElevated: "var(--color-background-primary)",
          },
          Table: {
            colorBgContainer: "var(--color-background-primary)",
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
            colorTextTertiary: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",
            colorFillSecondary: "var(--color-background-secondary)",
          },
          Layout: {
            siderBg: "var(--color-sidebar-background)",
            colorBgContainer: "var(--color-background-secondary)",
          },
          Menu: {
            colorBgContainer: "var(--color-background-secondary)",
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
            colorItemBg: "transparent",
            colorItemBgHover: "var(--color-background-hover)",
            colorItemBgSelected: "var(--color-background-selected)",
            colorItemBgActive: "var(--color-background-hover)",
            colorItemTextSelected: "var(--color-primary)",
            colorItemTextHover: "var(--color-text-primary)",
            colorItemText: "var(--color-text-primary)",
            colorIcon: "var(--color-text-primary)",
            colorIconHover: "var(--color-text-primary)",
            itemBg: "transparent",
            itemHoverBg: "var(--color-background-hover)",
            itemSelectedBg: "var(--color-background-selected)",
            itemActiveBg: "var(--color-background-hover)",
            controlOutline: "none",
          },
          Tabs: {
            colorBgContainer: "var(--color-background-secondary)",
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",
            colorFillSecondary: "var(--color-background-secondary)",
            colorFillTertiary: "var(--color-background-tertiary)",
            itemColor: "var(--color-text-secondary)",
            itemHoverColor: "var(--color-text-primary)",
            itemSelectedColor: "var(--color-primary)",
            itemActiveColor: "var(--color-primary)",
            inkBarColor: "var(--color-primary)",
            cardBg: "var(--color-background-secondary)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
