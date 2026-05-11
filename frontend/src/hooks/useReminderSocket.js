import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getSocketBaseUrl } from "../services/http";

/**
 * Kết nối Socket.IO giống backend: emit `join_user_room` với userId,
 * lắng nghe `reminder_notification`.
 */
export function useReminderSocket(userId, onReminder) {
  const cbRef = useRef(onReminder);
  cbRef.current = onReminder;

  useEffect(() => {
    if (userId == null) return;

    const base = getSocketBaseUrl();
    const socket = io(base || undefined, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    const onConnect = () => {
      socket.emit("join_user_room", userId);
    };

    const onPayload = (payload) => {
      cbRef.current?.(payload);
    };

    socket.on("connect", onConnect);
    socket.on("reminder_notification", onPayload);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("reminder_notification", onPayload);
      socket.disconnect();
    };
  }, [userId]);
}
