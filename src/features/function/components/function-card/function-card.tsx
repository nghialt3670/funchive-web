import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  useCompileFunctionMutation,
  useDeleteFunctionMutation,
} from "@/features/function/function-hooks";
import type { FunctionDetailDto } from "@/features/function/function-types";
import { getLanguageIcon } from "@/features/function/utils/icon-utils";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import {
  ArrowRightOutlined,
  BuildFilled,
  CopyFilled,
  DeleteFilled,
  EditFilled,
  EyeFilled,
  MoreOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Card, Dropdown, Tag, Tooltip, Typography } from "antd";
import {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  FunctionDetailContextProvider,
  useFunctionDetailContext,
} from "../../contexts/function-detail-context";
import { getTypeColor } from "../../utils/color-utils";
import { FunctionPopup } from "../function-popup";
import { TypeTooltip } from "../type-tooltip";
import styles from "./function-card.module.css";
import { FunctionStatusTag } from "../function-status-tag/function-status-tag";

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
  const [popupOpen, setPopupOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(e);
      return;
    }
    // Don't open popup if clicking on buttons or dropdowns
    if ((e.target as HTMLElement).closest("button, .ant-dropdown, .ant-btn")) {
      return;
    }
    // Open popup by default instead of navigating
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <FunctionDetailContextProvider functionDetail={functionDetail}>
      <Card onClick={handleCardClick} bodyStyle={{ padding: 0 }} hoverable>
        {children}
      </Card>
      <FunctionPopup
        functionDetail={functionDetail}
        open={popupOpen}
        onClose={handleClosePopup}
      />
    </FunctionDetailContextProvider>
  );
};

export const FunctionCardHeader: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.functionCardHeader}>{children}</div>;
};

export const FunctionCardBody: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.functionCardBody}>{children}</div>;
};

export const FunctionCardFooter: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.cardActions}>
      <FunctionCompileOrExecuteButton />
      <FunctionOptions />
      {children}
    </div>
  );
};

export const FunctionLanguageIcon: FC = () => {
  const { implementation } = useFunctionDetailContext();
  return getLanguageIcon(implementation.language);
};

export const FunctionName: FC = () => {
  const { id, definition } = useFunctionDetailContext();
  const navigate = useNavigate();

  const handleNameClick = () => {
    navigate(`/functions/${id}`);
  };

  return (
    <Paragraph
      className={styles.functionName}
      ellipsis={{ rows: 2 }}
      onClick={handleNameClick}
    >
      {definition.name}
    </Paragraph>
  );
};

export const FunctionDescription: FC = () => {
  const { definition } = useFunctionDetailContext();

  return (
    <Paragraph
      ellipsis={{ rows: 3, expandable: false }}
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
      <Text type="secondary" className={styles.inputOutputTypesLabel}>
        Input/Output:
      </Text>
      <div className={styles.inputOutputTypes}>
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
    </div>
  );
};

  export const FunctionCompilationStatus: FC = () => {
  const functionDetail = useFunctionDetailContext();

  return (
    <div className={styles.compilationSection}>
      <Text type="secondary" className={styles.compilationLabel}>
        Status:
      </Text>
      <FunctionStatusTag functionDetail={functionDetail} />
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

  const handleCompile = (e: MouseEvent) => {
    e.stopPropagation();
    compileMutation.mutate(id);
  };

  return (
    <Tooltip title={t("compile-function")} key="compile">
      <Button
        className={styles.actionButton}
        onClick={handleCompile}
        aria-label="Compile function"
        icon={<BuildFilled />}
      />
    </Tooltip>
  );
};

export const FunctionExecuteButton: FC = () => {
  const navigate = useNavigate();
  const { t } = useNamespacedTranslation();
  const { id } = useFunctionDetailContext();

  const handleExecute = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/pipelines/new?functionId=${id}`);
  };

  return (
    <Tooltip title={t("execute-function")} key="execute">
      <button
        className={styles.actionButton}
        onClick={handleExecute}
        aria-label="Execute function"
      >
        <PlayCircleFilled />
        {t("execute")}
      </button>
    </Tooltip>
  );
};

export const FunctionOptions: FC = () => {
  const { id } = useFunctionDetailContext();
  const navigate = useNavigate();
  const deleteMutation = useDeleteFunctionMutation();

  const dropdownItems: MenuProps["items"] = [
    {
      key: "view",
      label: "View Details",
      icon: <EyeFilled />,
      onClick: () => navigate(`/functions/${id}`),
    },
    {
      key: "edit",
      label: "Edit Function",
      icon: <EditFilled />,
      onClick: () => navigate(`/functions/${id}/edit`),
    },
    {
      key: "clone",
      label: "Clone Function",
      icon: <CopyFilled />,
      onClick: () => navigate(`/functions/${id}/clone`),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete",
      icon: (
        <ConfirmDialog
          message="Are you sure you want to delete this function?"
          onConfirm={() => deleteMutation.mutate(id)}
        >
          <DeleteFilled />
        </ConfirmDialog>
      ),
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items: dropdownItems }} trigger={["hover"]}>
      <button
        className={styles.actionButton}
        onClick={(e) => e.stopPropagation()}
        aria-label="More options"
      >
        <MoreOutlined />
      </button>
    </Dropdown>
  );
};
