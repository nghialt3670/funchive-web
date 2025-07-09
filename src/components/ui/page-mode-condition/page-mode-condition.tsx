import type { PageMode } from "@/contexts/page-mode-context";
import { usePageMode } from "@/hooks/use-page-mode";
import { type FC, type PropsWithChildren } from "react";

interface PageModeConditionProps extends PropsWithChildren {
  modes: PageMode[];
}

export const PageModeCondition: FC<PageModeConditionProps> = ({
  children,
  modes,
}) => {
  const { pageMode } = usePageMode();

  if (!modes.includes(pageMode)) {
    return null;
  }

  return <>{children}</>;
};
