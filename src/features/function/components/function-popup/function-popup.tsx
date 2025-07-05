import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { HorizontalLine } from "@/components/ui/line/line.tsx";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import { tryCloneNodeWithOnClick } from "@/utils/element-utils";
import {
  ArrowRightOutlined,
  BuildFilled,
  CopyFilled,
  DeleteFilled,
  EditFilled,
  EyeFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Box } from "@mui/material";
import { Button, Modal, Space, Tooltip, Typography } from "antd";
import { type FC, type PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { FunctionDetailDto } from "@/features/function/types";
import {
  useCompileFunctionMutation,
  useDeleteFunctionMutation,
} from "../../hooks";
import { FunctionStatusTag } from "../function-status-tag/function-status-tag";
import { TypeTag } from "../type-tag";
import { TypeTooltip } from "../type-tooltip";

const { Title, Text, Paragraph } = Typography;

export interface FunctionPopupProps extends PropsWithChildren {
  functionDetail: FunctionDetailDto;
}

export const FunctionPopup: FC<FunctionPopupProps> = ({
  functionDetail,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { t: tNs } = useNamespacedTranslation();
  const navigate = useNavigate();
  const compileMutation = useCompileFunctionMutation();
  const deleteMutation = useDeleteFunctionMutation();

  const { id, name, description, inputType, outputType, implementations } =
    functionDetail;

  // For now, we'll assume we can run if there are implementations
  // Later this should check actual compilation status from implementation details
  const canRun = implementations.length > 0;

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompile = () => {
    // Use first implementation for compilation - in real app you'd want to select which one
    if (implementations.length > 0) {
      compileMutation.mutate({
        functionId: id,
        implementationId: implementations[0].id,
      });
    }
  };

  const handleExecute = () => {
    navigate(`/pipelines/new?functionId=${id}`);
  };

  const clonedChildren = tryCloneNodeWithOnClick(children, (e) => {
    e.stopPropagation();
    setOpen(true);
  });

  return (
    <>
      {clonedChildren}
      <Modal
        title={
          <Box display="flex" alignItems="center" gap={3}>
            <Title level={4} style={{ margin: 0 }}>
              {name}
            </Title>
          </Box>
        }
        open={open}
        onCancel={handleClose}
        width={800}
        centered
        footer={
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            {/* Primary Action Button */}
            {canRun ? (
              <Tooltip title={tNs("execute-function")}>
                <Button
                  type="primary"
                  icon={<PlayCircleFilled />}
                  onClick={handleExecute}
                >
                  {tNs("execute")}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title={tNs("compile-function")}>
                <Button
                  type="primary"
                  icon={<BuildFilled />}
                  onClick={handleCompile}
                  loading={compileMutation.isPending}
                  disabled={implementations.length === 0}
                >
                  {tNs("compile")}
                </Button>
              </Tooltip>
            )}

            {/* Action Buttons */}
            <Space>
              <Tooltip title="View Details">
                <Button
                  icon={<EyeFilled />}
                  onClick={() => navigate(`/functions/${id}`)}
                >
                  {t("details")}
                </Button>
              </Tooltip>
              <Tooltip title="Edit Function">
                <Button
                  icon={<EditFilled />}
                  onClick={() => navigate(`/functions/${id}/edit`)}
                >
                  {t("edit")}
                </Button>
              </Tooltip>
              <Tooltip title="Clone Function">
                <Button
                  icon={<CopyFilled />}
                  onClick={() => navigate(`/functions/${id}/clone`)}
                >
                  {t("clone")}
                </Button>
              </Tooltip>
              <ConfirmDialog
                message="Are you sure you want to delete this function?"
                onConfirm={() => deleteMutation.mutate(id)}
              >
                <Button danger icon={<DeleteFilled />}>
                  {t("delete")}
                </Button>
              </ConfirmDialog>
            </Space>
          </Box>
        }
        style={{ padding: 0 }}
      >
        <Box display="flex" flexDirection="column" gap={3} padding="1rem 0">
          {/* Description Section */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Text strong>{t("description")}:</Text>
            <Paragraph
              style={{
                margin: 0,
                color: "var(--color-text-secondary)",
                fontSize: "0.875rem",
                lineHeight: 1.6,
              }}
            >
              {description}
            </Paragraph>
          </Box>

          <HorizontalLine />

          {/* Input/Output Types Section */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Text strong>{t("input-output")}:</Text>
            <Box display="flex" alignItems="center" gap={2}>
              <TypeTooltip type={inputType}>
                <TypeTag type={inputType} />
              </TypeTooltip>
              <ArrowRightOutlined />
              <TypeTooltip type={outputType}>
                <TypeTag type={outputType} />
              </TypeTooltip>
            </Box>
          </Box>

          <HorizontalLine />

          {/* Status Section */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Text strong>{t("status")}:</Text>
            <FunctionStatusTag functionDetail={functionDetail} />
          </Box>
        </Box>
      </Modal>
    </>
  );
};
