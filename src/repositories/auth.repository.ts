import { User, LoginPayload, RegisterPayload } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

export interface AuthRepository {
  login(payload: LoginPayload): Promise<{ user: User; accessToken: string }>;
  register(payload: RegisterPayload): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class HttpAuthRepository implements AuthRepository {
  async login(payload: LoginPayload): Promise<{ user: User; accessToken: string }> {
    return await authService.login(payload);
  }

  async register(payload: RegisterPayload): Promise<User> {
    return await authService.register(payload);
  }

  async logout(): Promise<void> {
    await authService.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await authService.getCurrentUser();
    } catch {
      return null;
    }
  }
}

export class MockAuthRepository implements AuthRepository {
  async login(payload: LoginPayload): Promise<{ user: User; accessToken: string }> {
    return await authService.login(payload);
  }

  async register(payload: RegisterPayload): Promise<User> {
    return await authService.register(payload);
  }

  async logout(): Promise<void> {
    await authService.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await authService.getCurrentUser();
    } catch {
      return null;
    }
  }
}
