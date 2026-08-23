/**
 * Application environment configuration schema and validation.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false", // default to true
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export type Env = typeof env;
