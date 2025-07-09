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
          colorTextDisabled: "var(--color-text-disabled)",
          colorBgContainerDisabled: "var(--color-background-disabled)",
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
          Collapse: {
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",
            colorFillSecondary: "var(--color-background-secondary)",
          },
          Input: {
            colorText: "var(--color-text-primary)",
            colorTextPlaceholder: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            activeBorderColor: "var(--color-border-focus)",
            hoverBorderColor: "var(--color-border-hover)",
            activeShadow: "none",
            controlOutline: "none",
            colorBgContainer: "var(--color-background-primary)",
            colorBgContainerDisabled: "var(--color-background-disabled)",
            colorTextDisabled: "var(--color-text-disabled)",
          },
          InputNumber: {
            colorText: "var(--color-text-primary)",
            colorTextPlaceholder: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            activeBorderColor: "var(--color-border-focus)",
            hoverBorderColor: "var(--color-border-hover)",
            controlOutline: "none",
            colorBgContainer: "var(--color-background-primary)",
            colorBgContainerDisabled: "var(--color-background-disabled)",
            colorTextDisabled: "var(--color-text-disabled)",
          },
          Switch: {
            colorText: "var(--color-text-primary)",
            colorTextPlaceholder: "var(--color-text-tertiary)",
            colorBorder: "var(--color-border)",
            colorPrimary: "var(--color-primary)",
            colorPrimaryHover: "var(--color-primary-hover)",
            colorPrimaryActive: "var(--color-primary-active)",
            colorPrimaryBorder: "var(--color-border)",
            colorPrimaryBorderHover: "var(--color-border-hover)",
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
            colorIcon: "var(--color-text-secondary)",
            colorIconHover: "var(--color-text-primary)",
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
          Message: {
            colorBgContainer: "var(--color-background-primary)",
            colorText: "var(--color-text-primary)",
            colorTextSecondary: "var(--color-text-secondary)",
            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",
            colorBgBase: "var(--color-background-primary)",
            colorBgElevated: "var(--color-background-primary)",
            colorBgLayout: "var(--color-background-primary)",
            colorBgMask: "var(--color-background-primary)",
            colorBgSpotlight: "var(--color-background-primary)",
            colorIcon: "var(--color-text-secondary)",
            colorIconHover: "var(--color-text-primary)",
          },
        },
      }}
    >
      <style>
        {`
          /* Readonly input styling */
          .ant-input[readonly],
          .ant-input-number[readonly] {
            background-color: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
            cursor: default !important;
          }
          
          .ant-input[readonly]:hover,
          .ant-input-number[readonly]:hover {
            border-color: transparent !important;
          }
          
          .ant-input[readonly]:focus,
          .ant-input-number[readonly]:focus {
            border-color: transparent !important;
            box-shadow: none !important;
          }
          
          .ant-input[readonly]::placeholder,
          .ant-input-number[readonly]::placeholder {
            color: var(--color-text-tertiary) !important;
          }
          
          /* Select arrow icon color */
          .ant-select .ant-select-arrow {
            color: var(--color-text-secondary) !important;
          }
          
          .ant-select:hover .ant-select-arrow {
            color: var(--color-text-primary) !important;
          }
          
          .ant-select-focused .ant-select-arrow {
            color: var(--color-text-primary) !important;
          }
          
          .ant-select-open .ant-select-arrow {
            color: var(--color-text-primary) !important;
          }
          
          /* Center collapse icon vertically */
          .ant-collapse-header {
            display: flex !important;
            align-items: center !important;
            height: 3rem !important;
          }
          
          .ant-collapse-header-text {
            flex: 1 !important;
            margin-left: 0px !important;
          }
          
          /* Remove ALL focus rings and active states from inputs */
          .ant-input,
          .ant-input:hover,
          .ant-input:focus,
          .ant-input:active,
          .ant-input-focused,
          .ant-input:focus-within,
          .ant-input:focus-visible {
            border-color: var(--color-border) !important;
            box-shadow: none !important;
            outline: none !important;
            outline-offset: 0 !important;
          }
          
          .ant-input-number,
          .ant-input-number:hover,
          .ant-input-number:focus,
          .ant-input-number:active,
          .ant-input-number-focused,
          .ant-input-number:focus-within,
          .ant-input-number:focus-visible,
          .ant-input-number .ant-input-number-input,
          .ant-input-number .ant-input-number-input:focus,
          .ant-input-number .ant-input-number-input:active {
            border-color: var(--color-border) !important;
            box-shadow: none !important;
            outline: none !important;
            outline-offset: 0 !important;
          }
          
          .ant-select,
          .ant-select:hover,
          .ant-select:focus,
          .ant-select:active,
          .ant-select-focused,
          .ant-select:focus-within,
          .ant-select:focus-visible,
          .ant-select .ant-select-selector,
          .ant-select .ant-select-selector:hover,
          .ant-select .ant-select-selector:focus,
          .ant-select .ant-select-selector:active {
            border-color: var(--color-border) !important;
            box-shadow: none !important;
            outline: none !important;
            outline-offset: 0 !important;
          }
          
          .ant-input-affix-wrapper,
          .ant-input-affix-wrapper:hover,
          .ant-input-affix-wrapper:focus,
          .ant-input-affix-wrapper:active,
          .ant-input-affix-wrapper-focused,
          .ant-input-affix-wrapper:focus-within,
          .ant-input-affix-wrapper:focus-visible {
            border-color: var(--color-border) !important;
            box-shadow: none !important;
            outline: none !important;
            outline-offset: 0 !important;
          }
          
          /* Remove focus rings from textarea */
          .ant-input[data-textarea],
          .ant-input[data-textarea]:hover,
          .ant-input[data-textarea]:focus,
          .ant-input[data-textarea]:active,
          .ant-input[data-textarea]:focus-within,
          .ant-input[data-textarea]:focus-visible {
            border-color: var(--color-border) !important;
            box-shadow: none !important;
            outline: none !important;
            outline-offset: 0 !important;
          }
          
          /* Universal focus ring removal */
          *:focus,
          *:focus-visible,
          *:focus-within {
            outline: none !important;
            outline-offset: 0 !important;
            box-shadow: none !important;
          }
        `}
      </style>
      {children}
    </ConfigProvider>
  );
};
