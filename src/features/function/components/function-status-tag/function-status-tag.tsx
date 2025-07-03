import type { FunctionDetailDto } from "@/features/function/types";
// import { getCompilationStatusColor } from "@/features/function/utils/color-utils";
import { getCompilationStatusIcon } from "@/features/function/utils/icon-utils";
import { getCompilationStatusLabel } from "@/features/function/utils/label-utils";
import { Tag } from "antd";
import { type FC } from "react";

import styles from "./function-status-tag.module.css";

export interface FunctionStatusTagProps {
  functionDetail: FunctionDetailDto;
}

export const FunctionStatusTag: FC<FunctionStatusTagProps> = ({
  functionDetail,
}) => {
  // const compilationStatusColor = getCompilationStatusColor(
  //   functionDetail.compilationStatus,
  // );
  const compilationStatusIcon = getCompilationStatusIcon(
    functionDetail.compilationStatus,
  );
  const compilationStatusLabel = getCompilationStatusLabel(
    functionDetail.compilationStatus,
  );

  return (
    <Tag
      // color={compilationStatusColor}
      className={styles.functionStatusTag}
      icon={compilationStatusIcon}
    >
      {compilationStatusLabel}
    </Tag>
  );
};
