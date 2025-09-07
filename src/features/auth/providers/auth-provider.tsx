import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
} from "react";

import { getCurrentUser } from "../api/get-current-user";
import type { User } from "../types/auth-types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getCurrentUser,
    enabled: !!localStorage.getItem("authToken"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Clear user data when token is removed
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && !e.newValue) {
        queryClient.setQueryData(["auth", "user"], null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [queryClient]);

  const contextValue: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
