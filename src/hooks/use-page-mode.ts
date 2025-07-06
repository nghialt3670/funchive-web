import { PageModeContext } from "@/contexts/page-mode-context";
import { useContext } from "react";

export const usePageMode = () => {
  const context = useContext(PageModeContext);
  if (!context) {
    throw new Error("usePageMode must be used within a PageModeProvider");
  }
  return context;
};
