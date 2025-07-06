import { createContext } from "react";

export type PageMode = "create" | "view" | "edit";

export const PageModeContext = createContext<{
  pageMode: PageMode;
  setPageMode: (pageMode: PageMode) => void;
}>({
  pageMode: "view",
  setPageMode: () => {},
});
