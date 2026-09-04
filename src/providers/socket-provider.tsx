"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { useAuth } from "@/lib/auth/auth-context";

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = React.createContext<SocketContextType>({ isConnected: false });

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = React.useState(socket.connected);

  React.useEffect(() => {
    const userId = user?.id || user?._id;

    if (isAuthenticated && userId) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join_room", userId);

      const onConnect = () => {
        setIsConnected(true);
        socket.emit("join_room", userId);
      };

      const onDisconnect = () => {
        setIsConnected(false);
      };

      const onNewMessage = (data: any) => {
        console.log("⚡ [SOCKET] Real-time new_message received:", data);
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        if (data?.message?.conversationId) {
          queryClient.invalidateQueries({
            queryKey: ["messages", data.message.conversationId],
          });
        }
      };

      const onConversationUpdated = (data: any) => {
        console.log("⚡ [SOCKET] Real-time conversation_updated received:", data);
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      };

      const onMessageStatusUpdated = (data: any) => {
        console.log("⚡ [SOCKET] Real-time message_status_updated received:", data);
        if (data?.conversationId) {
          queryClient.invalidateQueries({
            queryKey: ["messages", data.conversationId],
          });
        }
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("new_message", onNewMessage);
      socket.on("conversation_updated", onConversationUpdated);
      socket.on("message_status_updated", onMessageStatusUpdated);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("new_message", onNewMessage);
        socket.off("conversation_updated", onConversationUpdated);
        socket.off("message_status_updated", onMessageStatusUpdated);
        socket.emit("leave_room", userId);
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated, user, queryClient]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return React.useContext(SocketContext);
}
