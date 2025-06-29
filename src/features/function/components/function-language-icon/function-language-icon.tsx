import { getLanguageIcon } from "@/features/function/utils/icon-utils";
import { type FunctionDetailDto } from "@/features/function/function-types";
import { type FC } from "react";

export interface FunctionLanguageIconProps {
  functionDetail: FunctionDetailDto;
}

export const FunctionLanguageIcon: FC<FunctionLanguageIconProps> = ({ functionDetail }) => {
  return getLanguageIcon(functionDetail.implementation.language);
};