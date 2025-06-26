import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app.tsx";
import { AntdProvider } from "./components/antd-provider";
import { ThemeProvider } from "./contexts/theme-context";
import "./index.css";
import "./lib/i18n";
import { queryClient } from "./lib/query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AntdProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AntdProvider>
    </ThemeProvider>
  </StrictMode>,
);
