import { type PageMode, PageModeContext } from "@/contexts/page-mode-context";
import { type PropsWithChildren, useState } from "react";

interface PageModeProviderProps extends PropsWithChildren {
  pageMode: PageMode;
}

export const PageModeProvider: React.FC<PageModeProviderProps> = ({
  children,
  pageMode,
}) => {
  const [internalPageMode, setInternalPageMode] = useState<PageMode>(pageMode);
  return (
    <PageModeContext.Provider
      value={{ pageMode: internalPageMode, setPageMode: setInternalPageMode }}
    >
      {children}
    </PageModeContext.Provider>
  );
};
