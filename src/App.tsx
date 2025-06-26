import './app.css';
import { FunctionsPage, FunctionPage } from '@/pages/functions';
import { PipelinesPage, PipelinePage } from '@/pages/pipelines';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
