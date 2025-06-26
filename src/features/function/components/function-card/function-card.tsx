import { Button } from "@/components/button/button";
import { NamespaceProvider } from "@/contexts/namespace-context";
import {
  useCompileFunctionMutation,
  useDeleteFunctionMutation,
} from "@/features/function/function-hooks";
import type { FunctionDetailDto } from "@/features/function/function-types";
import { getLanguageIcon } from "@/features/function/utils/icon-utils";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import {
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Tag, Tooltip, Typography } from "antd";
import { type FC, type MouseEvent, type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  FunctionDetailContextProvider,
  useFunctionDetailContext,
} from "../../contexts/function-detail-context";
import {
  getCompilationStatusColor,
  getTypeColor,
} from "../../utils/color-utils";
import { getCompilationStatusIcon } from "../../utils/icon-utils";
import { getCompilationStatusLabel } from "../../utils/label-utils";
import { TypeTooltip } from "../type-tooltip";
import styles from "./function-card.module.css";

const { Text, Paragraph } = Typography;

export interface FunctionCardProps extends PropsWithChildren {
  functionDetail: FunctionDetailDto;
  onCardClick?: (e: MouseEvent) => void;
}

export const FunctionCard: FC<FunctionCardProps> = ({
  functionDetail,
  children,
  onCardClick,
}) => {
  const navigate = useNavigate();
  const namespace = "function";

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(e);
      return;
    }
    // Don't navigate if clicking on buttons or dropdowns
    if ((e.target as HTMLElement).closest("button, .ant-dropdown")) {
      return;
    }
    navigate(`/functions/${functionDetail.id}`);
  };

  return (
    <NamespaceProvider namespace={namespace}>
      <FunctionDetailContextProvider functionDetail={functionDetail}>
        <div className={styles.functionCard} onClick={handleCardClick}>
          {children}
        </div>
      </FunctionDetailContextProvider>
    </NamespaceProvider>
  );
};

export const FunctionCardHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.functionCardHeader}>
      {children}
    </div>
  );
};

export const FunctionCardBody: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.functionCardBody}>{children}</div>;
};

export const FunctionCardFooter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.functionCardFooter}>
      {children}
    </div>
  );
};

export const FunctionLanguageIcon: FC = () => {
  const { implementation } = useFunctionDetailContext();
  return getLanguageIcon(implementation.language);
};

export const FunctionName: FC = () => {
  const { t } = useTranslation();
  const { definition } = useFunctionDetailContext();

  return (
    <Paragraph
      ellipsis={{ rows: 3, expandable: true, symbol: t("show-more") }}
      strong
      className={styles.functionName}
    >
      {definition.name}
    </Paragraph>
  );
};

export const FunctionDescription: FC = () => {
  const { t } = useTranslation();
  const { definition } = useFunctionDetailContext();

  return (
    <Paragraph
      ellipsis={{ rows: 3, expandable: true, symbol: t("show-more") }}
      className={styles.functionDescription}
    >
      {definition.description}
    </Paragraph>
  );
};

export const FunctionInputOutputTypes: FC = () => {
  const { definition } = useFunctionDetailContext();
  const inputTypeColor = getTypeColor(definition.inputType);
  const outputTypeColor = getTypeColor(definition.outputType);

  return (
    <div className={styles.functionInputOutputTypes}>
      <TypeTooltip type={definition.inputType}>
        <Tag color={inputTypeColor} className={styles.inputTypeTag}>
          {definition.inputType.name}
        </Tag>
      </TypeTooltip>
      <ArrowRightOutlined />
      <TypeTooltip type={definition.outputType}>
        <Tag color={outputTypeColor} className={styles.outputTypeTag}>
          {definition.outputType.name}
        </Tag>
      </TypeTooltip>
    </div>
  );
};

export const FunctionCompilationStatus: FC = () => {
  const { compilationStatus } = useFunctionDetailContext();
  const compilationStatusColor = getCompilationStatusColor(compilationStatus);
  const compilationStatusIcon = getCompilationStatusIcon(compilationStatus);
  const compilationStatusLabel = getCompilationStatusLabel(compilationStatus);

  return (
    <div className={styles.compilationSection}>
      <Text type="secondary" className={styles.compilationLabel}>
        Compilation:
      </Text>
      <Tag
        color={compilationStatusColor}
        className={styles.compilationTag}
        icon={compilationStatusIcon}
      >
        {compilationStatusLabel}
      </Tag>
    </div>
  );
};

export const FunctionCompileOrExecuteButton: FC = () => {
  const { compilationStatus } = useFunctionDetailContext();
  const canRun = compilationStatus === "SUCCESS";
  const needsCompilation = ["NOT_STARTED", "OUTDATED", "FAILED"].includes(
    compilationStatus,
  );

  if (canRun) {
    return <FunctionExecuteButton />;
  }

  if (needsCompilation) {
    return <FunctionCompileButton />;
  }

  return <FunctionCompileButton />;
};

export const FunctionCompileButton: FC = () => {
  const { t } = useNamespacedTranslation();
  const { id } = useFunctionDetailContext();
  const compileMutation = useCompileFunctionMutation();

  const handleCompile = () => {
    compileMutation.mutate(id);
  };

  return (
    <Tooltip title={t("compile-function")} key="compile">
      <Button
        type="text"
        icon={<RocketOutlined />}
        onClick={handleCompile}
        className={styles.functionCompileButton}
      >
        {t("compile")}
      </Button>
    </Tooltip>
  );
};

export const FunctionExecuteButton: FC = () => {
  const navigate = useNavigate();
  const { t } = useNamespacedTranslation();
  const { id } = useFunctionDetailContext();

  const handleExecute = () => {
    navigate(`/pipelines/new?functionId=${id}`);
  };

  return (
    <Tooltip title={t("execute-function")} key="execute">
      <Button
        type="text"
        icon={<PlayCircleOutlined />}
        onClick={handleExecute}
        className={styles.functionExecuteButton}
      >
        {t("execute")}
      </Button>
    </Tooltip>
  );
};

export const FunctionOptions: FC = () => {
  const { id } = useFunctionDetailContext();
  const navigate = useNavigate();
  const deleteMutation = useDeleteFunctionMutation();

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

  return (
    <Dropdown menu={{ items: dropdownItems }} trigger={["hover"]}>
      <Button
        type="text"
        onClick={(e) => e.stopPropagation()}
        icon={<MoreOutlined />}
      />
    </Dropdown>
  );
};
