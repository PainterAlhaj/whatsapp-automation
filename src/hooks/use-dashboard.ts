import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStatsData } from "@/types/dashboard.types";

export const DASHBOARD_QUERY_KEY = ["dashboard", "stats"] as const;

/**
 * Hook to fetch live Dashboard statistics from backend API.
 * Uses 30s stale time and 45s automatic polling interval.
 */
export const useDashboardStats = () => {
  return useQuery<DashboardStatsData, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 1000 * 30, // Consider stats fresh for 30 seconds
    refetchInterval: 1000 * 45, // Poll every 45 seconds for background updates
    refetchOnWindowFocus: true,
  });
};
