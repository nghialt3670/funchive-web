import { LoginCallbackPage } from "@/features/auth/pages/login-callback-page/login-callback.page.tsx";
import { LogoutCallbackPage } from "@/features/auth/pages/logout-callback-page";
import { FunctionPage } from "@/pages/function";
import { FunctionsPage } from "@/pages/functions";
import { PipelinePage } from "@/pages/pipeline";
import { PipelinesPage } from "@/pages/pipelines";
import { RootLayout } from "@components/layouts/root-layout";
import { NamespaceProvider } from "@components/providers/namespace-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./app.css";
import { PageModeProvider } from "./components/providers/page-mode-provider";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/callback" element={<LoginCallbackPage />} />
        <Route path="/logout/callback" element={<LogoutCallbackPage />} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<div>Home</div>} />
          <Route
            path="functions"
            element={
              <NamespaceProvider namespace="function">
                <FunctionsPage />
              </NamespaceProvider>
            }
          />
          <Route
            path="functions/new"
            element={
              <NamespaceProvider namespace="function">
                <PageModeProvider pageMode="create">
                  <FunctionPage />
                </PageModeProvider>
              </NamespaceProvider>
            }
          />
          <Route
            path="functions/:id"
            element={
              <NamespaceProvider namespace="function">
                <PageModeProvider pageMode="view">
                  <FunctionPage />
                </PageModeProvider>
              </NamespaceProvider>
            }
          />
          <Route path="pipelines" element={<PipelinesPage />} />
          <Route path="pipelines/new" element={<PipelinePage />} />
          <Route path="pipelines/:id" element={<PipelinePage />} />
          <Route path="pipelines/:id/edit" element={<PipelinePage />} />
          <Route path="pipelines/:id/run" element={<PipelinePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
