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
          borderRadius: 8,
          colorText: "var(--color-text-primary)",
          colorTextSecondary: "var(--color-text-secondary)",
          colorTextTertiary: "var(--color-text-tertiary)",
          colorBorder: "var(--color-border)",
          colorBorderSecondary: "var(--color-border)",
          colorFillSecondary: "var(--color-background-secondary)",
          colorBgContainer: "var(--color-background-primary)",
        },
        components: {
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
          },
          Button: {
            colorText: "var(--color-text-primary)",
            colorBorder: "var(--color-border)",
          },
          Popover: {
            colorBgElevated: "var(--color-background-primary)",
          },
          Dropdown: {
            colorBgElevated: "var(--color-background-primary)",
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
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
