import { BREAKPOINTS } from "@/config/constants";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebarCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  // For overlay mode (mobile/tablet) - controls whether sidebar is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // For collapsible mode (desktop) - controls whether sidebar is collapsed
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= BREAKPOINTS.TABLET;
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Close overlay sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const sidebar = document.querySelector("[data-sidebar]");
      const menuButton = document.querySelector("[data-menu-button]");

      if (
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(target) &&
        menuButton &&
        !menuButton.contains(target)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Handle route changes - close overlay on navigation
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth <= BREAKPOINTS.TABLET) {
        closeSidebar();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= BREAKPOINTS.TABLET) {
        // Switch to overlay mode - close overlay and set collapsed
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(true);
      }
      // Note: We don't auto-expand on desktop to respect user preference
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value = {
    isSidebarOpen,
    isSidebarCollapsed,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapse,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
