import { PipelineEditor } from "@/features/pipeline/components/pipeline-editor";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const PipelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return <PipelineEditor pipelineId={id} onBack={handleBack} />;
};
