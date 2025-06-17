import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PipelineEditor } from "@/features/pipeline/components/pipeline-editor";

export const PipelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/pipelines");
  };

  return (
    <PipelineEditor 
      pipelineId={id} 
      onBack={handleBack}
    />
  );
}; 