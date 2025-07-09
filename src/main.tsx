import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AntdConfigProvider } from "./components/providers/antd-config-provider";
import { MessageProvider } from "./components/providers/message-provider";
import { ThemeProvider } from "./components/providers/theme-provider";
import "./index.css";
import "./lib/i18n";
import { queryClient } from "./lib/query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AntdConfigProvider>
        <MessageProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </MessageProvider>
      </AntdConfigProvider>
    </ThemeProvider>
  </StrictMode>,
);
