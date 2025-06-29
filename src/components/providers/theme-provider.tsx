import {
  type ResolvedTheme,
  type Theme,
  ThemeContext,
  type ThemeContextType,
} from "@/contexts/theme-context.tsx";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";

export const STORAGE_KEY = "funchive-theme";

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  // Calculate resolved theme based on current theme setting
  const calculateResolvedTheme = (currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === "system") {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  // Update resolved theme when theme changes or system preference changes
  useEffect(() => {
    const newResolvedTheme = calculateResolvedTheme(theme);
    setResolvedTheme(newResolvedTheme);

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", newResolvedTheme);

    // Also apply to body for compatibility
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${newResolvedTheme}`);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newResolvedTheme = calculateResolvedTheme(theme);
      setResolvedTheme(newResolvedTheme);
      document.documentElement.setAttribute("data-theme", newResolvedTheme);
      document.body.className = document.body.className.replace(
        /theme-\w+/g,
        "",
      );
      document.body.classList.add(`theme-${newResolvedTheme}`);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
