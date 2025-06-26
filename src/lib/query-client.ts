import { QueryClient } from "@tanstack/react-query";
import { message } from "antd";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
      onError: (error: any) => {
        // Global error handling for mutations
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred";
        console.error("Mutation error:", error);

        // Don't show duplicate messages if individual hooks already handle errors
        if (!error.isHandled) {
          message.error(errorMessage);
        }
      },
    },
  },
});
