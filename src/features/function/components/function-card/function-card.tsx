import { FunctionLanguageIcon } from "@/features/function/components/function-language-icon/function-language-icon";
import { FunctionStatusTag } from "@/features/function/components/function-status-tag/function-status-tag";
import { TypeTag } from "@/features/function/components/type-tag/type-tag";
import { useCompileFunctionMutation } from "@/features/function/function-hooks";
import type { FunctionDetailDto } from "@/features/function/function-types";
import { useNamespacedTranslation } from "@/hooks/use-namespaced-translation";
import {
  ArrowRightOutlined,
  BuildFilled,
  CopyFilled,
  EditFilled,
  EyeFilled,
  MoreOutlined,
  PlaySquareFilled,
} from "@ant-design/icons";
import {type CardProps, type MenuProps} from "antd";
import { Button, Card, Dropdown, Tooltip, Typography } from "antd";
import { type FC, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate} from "react-router-dom";
import { Box } from "@mui/material";

import styles from "./function-card.module.css";
import {HorizontalLine} from "@components/ui/line/line.tsx";
import {TypeTooltip} from "@/features/function/components/type-tooltip";

const { Text, Link, Paragraph } = Typography;

export interface FunctionCardProps extends CardProps {
  functionDetail: FunctionDetailDto;
}

export const FunctionCard: FC<FunctionCardProps> = ({
                                                      functionDetail,
                                                      ...cardProps
                                                    }) => {
  const { t } = useTranslation();
  const { t: nt } = useNamespacedTranslation();
  const navigate = useNavigate();
  const compileMutation = useCompileFunctionMutation();

  const { id, definition, compilationStatus } = functionDetail;
  const canRun = compilationStatus === "SUCCESS";

  const handleCompile = (e: MouseEvent) => {
    e.stopPropagation();
    compileMutation.mutate(id);
  };

  const handleExecute = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/pipelines/new?functionId=${id}`);
  };

  const dropdownItems: MenuProps["items"] = [
    {
      key: "view",
      label: t("details"),
      icon: <EyeFilled />,
      onClick: () => navigate(`/functions/${id}`),
    },
    {
      key: "edit",
      label: t("edit"),
      icon: <EditFilled />,
      onClick: () => navigate(`/functions/${id}/edit`),
    },
    {
      key: "clone",
      label: t("clone"),
      icon: <CopyFilled />,
      onClick: () => navigate(`/functions/${id}/clone`),
    },
  ];

  return (
      <Card hoverable {...cardProps} bodyStyle={{padding: 0}}>
          {/* Header */}
          <Box margin="0.75rem" display="flex" alignItems="center" gap={1}>
            <FunctionLanguageIcon functionDetail={functionDetail} />
            <Link className={styles.functionName} onClick={() => navigate(`/functions/${id}`)}>
              {definition.name}
            </Link>
          </Box>

          <HorizontalLine />

          {/* Body */}
          <Box margin="0.75rem" display="flex" flexDirection="column" gap={1}>
            <Paragraph
                ellipsis={{ rows: 3 }}
                className={styles.functionDescription}
            >
              {definition.description}
            </Paragraph>

            <Box display="flex" flexDirection="row" gap={2}>
              <Text type="secondary">{t("in-out")}:</Text>
              <Box display="flex" alignItems="center" gap={1}>
                <TypeTooltip type={definition.inputType}>
                  <TypeTag type={definition.inputType} />
                </TypeTooltip>
                <ArrowRightOutlined />
                <TypeTooltip type={definition.outputType}>
                  <TypeTag type={definition.outputType} />
                </TypeTooltip>
              </Box>
            </Box>

            <Box display="flex" flexDirection="row" gap={2}>
              <Text type="secondary">{t("status")}:</Text>
              <FunctionStatusTag functionDetail={functionDetail} />
            </Box>
          </Box>

        <HorizontalLine />

        {/* Footer */}
        <Box display="flex" justifyContent="end" margin="0.5rem" gap={1}>
          <Tooltip title={canRun ? nt("execute-function") : nt("compile-function")}>
            <Button
                onClick={canRun ? handleExecute : handleCompile}
                icon={canRun ? <PlaySquareFilled /> : <BuildFilled />}
                aria-label={canRun ? nt("execute-function") : nt("compile-function")}
            />
          </Tooltip>
          <Tooltip title={t("more-options")}>
            <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
              <Button
                  onClick={(e) => e.stopPropagation()}
                  icon={<MoreOutlined />}
              />
            </Dropdown>
          </Tooltip>
        </Box>
      </Card>
  );
};