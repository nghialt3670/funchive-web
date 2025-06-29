// Re-export the useTheme hook for easier importing
import { ThemeContext } from "@/contexts/theme-context.tsx";
import { useContext } from "react";

export type { Theme, ResolvedTheme } from "@/contexts/theme-context";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
