import type { PipelineDetailDto } from "@/features/pipeline/pipeline-types";
import { EditFilled, PlayCircleFilled } from "@ant-design/icons";
import { Tooltip, Typography } from "antd";
import { type FC, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./pipeline-card.module.css";

const { Paragraph } = Typography;

export interface PipelineCardProps {
  pipeline: PipelineDetailDto;
  onCardClick?: (pipeline: PipelineDetailDto, e: MouseEvent) => void;
}

export const PipelineCard: FC<PipelineCardProps> = ({
  pipeline,
  onCardClick,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: MouseEvent) => {
    if (onCardClick) {
      onCardClick(pipeline, e);
      return;
    }
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest("button, .ant-btn")) {
      return;
    }
    navigate(`/pipelines/${pipeline.id}`);
  };

  const handleEditClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/pipelines/${pipeline.id}/edit`);
  };

  const handleRunClick = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/pipelines/${pipeline.id}/run`);
  };

  return (
    <div className={styles.pipelineCard} onClick={handleCardClick}>
      <div style={{ padding: "16px", flex: 1 }}>
        <div
          className={styles.cardTitle}
          onClick={() => navigate(`/pipelines/${pipeline.id}`)}
        >
          {pipeline.name}
        </div>

        <Paragraph
          ellipsis={{ rows: 3, expandable: false }}
          className={styles.cardDescription}
        >
          {pipeline.description}
        </Paragraph>

        <div className={styles.cardMeta}>
          <div className={styles.nodeCount}>
            {pipeline.nodes?.length || 0} nodes
          </div>
          <div className={styles.connectionCount}>
            {pipeline.connections?.length || 0} connections
          </div>
        </div>

        <div className={styles.cardFooter}>
          <span>
            Updated {new Date(pipeline.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <Tooltip title="Edit Pipeline">
          <button
            className={styles.actionButton}
            onClick={handleEditClick}
            aria-label="Edit pipeline"
          >
            <EditFilled />
          </button>
        </Tooltip>
        <Tooltip title="Run Pipeline">
          <button
            className={styles.actionButton}
            onClick={handleRunClick}
            aria-label="Run pipeline"
          >
            <PlayCircleFilled />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
