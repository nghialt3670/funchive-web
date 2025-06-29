import { FunctionPage } from "@/pages/function";
import { FunctionsPage } from "@/pages/functions";
import { PipelinePage } from "@/pages/pipeline";
import { PipelinesPage } from "@/pages/pipelines";
import { RootLayout } from "@components/layouts/root-layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<div>Home</div>} />
          <Route path="functions" element={<FunctionsPage />} />
          <Route path="functions/new" element={<FunctionPage />} />
          <Route path="functions/:id" element={<FunctionPage />} />
          <Route path="functions/:id/edit" element={<FunctionPage />} />
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
