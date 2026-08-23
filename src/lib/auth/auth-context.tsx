"use client";

import * as React from "react";
import { User, RegisterPayload } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load user session on mount
  const refreshUser = React.useCallback(async (): Promise<User | null> => {
    try {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("whatsflow_auth_token") || localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      }
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      // Session invalid or expired
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("whatsflow_auth_token");
        localStorage.removeItem("token");
      }
      return null;
    }
  }, []);

  React.useEffect(() => {
    async function loadSession() {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    }

    loadSession();
  }, [refreshUser]);

  // Listen for centralized unauthorized events triggered by 401 response interceptor
  React.useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("whatsflow_auth_token");
        localStorage.removeItem("token");
      }
    };

    window.addEventListener("whatsflow-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("whatsflow-unauthorized", handleUnauthorized);
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<User> => {
    const result = await authService.login({ email, password, rememberMe });
    setUser(result.user);
    setToken(result.accessToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("whatsflow_auth_token", result.accessToken);
    }
    return result.user;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const createdUser = await authService.register(payload);
    return createdUser;
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("Backend logout request failed, completing client-side logout:", err);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("whatsflow_auth_token");
        localStorage.removeItem("token");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
