import { getAntdLocale } from "@/lib/antd-locale";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface AntdProviderProps {
  children: ReactNode;
}

export const AntdProvider = ({ children }: AntdProviderProps) => {
  const { i18n } = useTranslation();
  const locale = getAntdLocale(i18n.language);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
