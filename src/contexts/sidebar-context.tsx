import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Initialize collapsed state based on screen size
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
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

  // Close sidebar when clicking outside on mobile
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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // On mobile, close the sidebar and ensure it's collapsed for proper behavior
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(true);
      } else {
        // On desktop, you might want to restore previous collapsed state
        // For now, let's not auto-expand to respect user preference
      }
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
