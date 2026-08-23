import axiosInstance from "./axios-instance";
import {
  User,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  CurrentUserResponse,
  LogoutResponse,
} from "@/types/auth.types";

/**
 * Frontend Service layer for Authentication endpoints.
 * Implements behavior strictly documented in AUTHENTICATION_API.md.
 */
export const authService = {
  /**
   * Register a new user account.
   * POST /auth/register
   * Note: Backend returns created user but does NOT return JWT tokens.
   */
  async register(payload: RegisterPayload): Promise<User> {
    const response = await axiosInstance.post<RegisterResponse>("/auth/register", payload);
    return response.data.data.user;
  },

  /**
   * Authenticate user credentials.
   * POST /auth/login
   * Returns user object and accessToken, sets HTTP-only cookies on backend.
   */
  async login(payload: LoginPayload): Promise<{ user: User; accessToken: string }> {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", payload);
    return response.data.data;
  },

  /**
   * Fetch currently logged-in user profile.
   * GET /auth/me
   * Requires Authorization header or HTTP-only cookie.
   */
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<CurrentUserResponse>("/auth/me");
    return response.data.data.user;
  },

  /**
   * Log out user, invalidate refresh token in MongoDB, clear cookies.
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    await axiosInstance.post<LogoutResponse>("/auth/logout");
  },
};

export default authService;
