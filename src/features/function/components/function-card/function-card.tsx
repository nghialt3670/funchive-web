import React from "react";
import type { MenuProps } from "antd";
import { Button, Card, Dropdown, Space, Tag, Tooltip, Typography } from "antd";
import {
  BugOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import styles from "./function-card.module.css";
import type {
  CompilationStatus,
  FunctionDetailDto,
} from "@/features/function/function-types";
import { useNavigate } from "react-router-dom";
import { getLanguageIcon } from "@/utils/icon-utils";
import { useDeleteFunction, useCompileFunction } from "@/features/function/function-hooks";

const { Text, Paragraph } = Typography;

export interface FunctionCardProps {
  functionDetail: FunctionDetailDto;
}

export const FunctionCard: React.FC<FunctionCardProps> = ({
  functionDetail,
}) => {
  const { id, definition, implementation, compilationStatus } = functionDetail;
  const navigate = useNavigate();
  
  const deleteMutation = useDeleteFunction();
  const compileMutation = useCompileFunction();

  const handleCompile = () => {
    compileMutation.mutate(id);
  };

  const handleEdit = () => {
    navigate(`/functions/${id}/edit`);
  };

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  const handleClone = () => {
    // TODO: Implement clone functionality
    console.log("Cloning function:", id);
  };

  const handleExecute = () => {
    navigate(`/pipelines/new?functionId=${id}`);
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "view",
      label: "View Details",
      icon: <EyeOutlined />,
      onClick: () => navigate(`/functions/${id}`),
    },
    {
      key: "edit",
      label: "Edit Function",
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: "clone",
      label: "Clone Function",
      icon: <CopyOutlined />,
      onClick: handleClone,
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete,
    },
  ];

  const getStatusColor = (status: CompilationStatus) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "error";
      case "IN_PROGRESS":
        return "processing";
      case "OUTDATED":
        return "warning";
      case "NOT_STARTED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: CompilationStatus) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircleOutlined />;
      case "FAILED":
        return <BugOutlined />;
      case "IN_PROGRESS":
        return <LoadingOutlined spin />;
      case "OUTDATED":
        return <ExclamationCircleOutlined />;
      case "NOT_STARTED":
        return <PauseCircleOutlined />;
      default:
        return <PauseCircleOutlined />;
    }
  };

  const getStatusText = (status: CompilationStatus) => {
    switch (status) {
      case "SUCCESS":
        return "SUCCESS";
      case "FAILED":
        return "FAILED";
      case "IN_PROGRESS":
        return "IN PROGRESS";
      case "OUTDATED":
        return "OUTDATED";
      case "NOT_STARTED":
        return "NOT STARTED";
      default:
        return status;
    }
  };

  const canRun = compilationStatus === "SUCCESS";
  const needsCompilation = ["NOT_STARTED", "OUTDATED", "FAILED"].includes(
    compilationStatus,
  );

  const cardActions = [
    canRun ? (
      <Tooltip title="Execute Function">
        <Button
          type="text"
          icon={<PlayCircleOutlined />}
          onClick={handleExecute}
          className={styles.executeButton}
        >
          Execute
        </Button>
      </Tooltip>
    ) : needsCompilation ? (
      <Tooltip title="Compile Function">
        <Button
          type="text"
          icon={<RocketOutlined />}
          onClick={handleCompile}
          className={styles.compileButton}
          loading={compilationStatus === "IN_PROGRESS"}
        >
          Compile
        </Button>
      </Tooltip>
    ) : (
      <Tooltip title="Compiling...">
        <Button type="text" icon={<LoadingOutlined spin />} disabled>
          Compiling
        </Button>
      </Tooltip>
    ),
    <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>,
  ];

  return (
    <Card
      title={
        <div className={styles.cardTitle}>
          <Text strong className={styles.functionName}>
            {definition.name}
          </Text>
          {getLanguageIcon(implementation.language)}
        </div>
      }
      actions={cardActions}
      className={styles.card}
      hoverable
    >
      <Space direction="vertical" className={styles.cardContent}>
        <Paragraph
          ellipsis={{ rows: 2, expandable: true }}
          className={styles.description}
        >
          {definition.description}
        </Paragraph>

        <div className={styles.typeSection}>
          <div>
            <Text type="secondary">Input: </Text>
            {definition.inputType?.name === "OBJECT" &&
            (definition.inputType as any)?.schema ? (
              <Tooltip
                title={
                  <div className={styles.tooltipContent}>
                    <div className={styles.tooltipFields}>
                      {Object.entries((definition.inputType as any).schema).map(
                        ([fieldName, fieldType]: [string, any]) => (
                          <div key={fieldName} className={styles.tooltipField}>
                            <div className={styles.tooltipFieldHeader}>
                              <span className={styles.tooltipFieldName}>
                                {fieldName}
                              </span>
                              <span className={styles.tooltipInputTag}>
                                {fieldType.name}
                              </span>
                            </div>
                            {fieldType.description && (
                              <div className={styles.tooltipFieldDescription}>
                                {fieldType.description}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                }
                placement="top"
                overlayStyle={{ zIndex: 9999 }}
              >
                <Tag color="geekblue" className={styles.inputTypeTag}>
                  {definition.inputType?.name || "Any"}
                </Tag>
              </Tooltip>
            ) : (
              <Tag color="geekblue" className={styles.inputTypeTag}>
                {definition.inputType?.name || "Any"}
              </Tag>
            )}
          </div>
          <div>
            <Text type="secondary">Output: </Text>
            {definition.outputType?.name === "OBJECT" &&
            (definition.outputType as any)?.schema ? (
              <Tooltip
                title={
                  <div className={styles.tooltipContent}>
                    <div className={styles.tooltipFields}>
                      {Object.entries(
                        (definition.outputType as any).schema,
                      ).map(([fieldName, fieldType]: [string, any]) => (
                        <div key={fieldName} className={styles.tooltipField}>
                          <div className={styles.tooltipFieldHeader}>
                            <span className={styles.tooltipOutputFieldName}>
                              {fieldName}
                            </span>
                            <span className={styles.tooltipOutputTag}>
                              {fieldType.name}
                            </span>
                          </div>
                          {fieldType.description && (
                            <div className={styles.tooltipFieldDescription}>
                              {fieldType.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                }
                placement="top"
                overlayStyle={{ zIndex: 9999 }}
              >
                <Tag color="green" className={styles.outputTypeTag}>
                  {definition.outputType?.name || "Any"}
                </Tag>
              </Tooltip>
            ) : (
              <Tag color="green" className={styles.outputTypeTag}>
                {definition.outputType?.name || "Any"}
              </Tag>
            )}
          </div>
        </div>

        {/* Compilation Status */}
        <div className={styles.compilationSection}>
          <Text type="secondary" className={styles.compilationLabel}>
            Compilation:
          </Text>
          <Tag
            color={getStatusColor(compilationStatus)}
            className={styles.compilationTag}
            icon={getStatusIcon(compilationStatus)}
          >
            {getStatusText(compilationStatus)}
          </Tag>
        </div>
      </Space>
    </Card>
  );
};
