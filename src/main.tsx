import { AntdConfigProvider } from "@components/providers/antd-config-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app.tsx";
import { ThemeProvider } from "./contexts/theme-context";
import "./index.css";
import "./lib/i18n";
import { queryClient } from "./lib/query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AntdConfigProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AntdConfigProvider>
    </ThemeProvider>
  </StrictMode>,
);
