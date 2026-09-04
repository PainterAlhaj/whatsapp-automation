import { io, Socket } from "socket.io-client";
import { env } from "@/config/env";

// Extract backend origin URL from apiBaseUrl (e.g., http://localhost:5000)
const SOCKET_URL = env.apiBaseUrl.replace(/\/api\/v1\/?$/, "");

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});
