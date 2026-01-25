"use client"

import { useEffect, useState } from "react";

export function useChatSockets() {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<string>('📶');

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:5000/ws');

    ws.onopen = () => {
      setStatus('🔗')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, `[${data.username}]: ${data.content}`]);
    };

    ws.onerror = (error) => {
      console.log(error);
      setStatus('⛓️‍💥');
    }

    ws.onclose = () => {
      console.log("ws closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessages = (data: { username: string; content: string }) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  };

  return { messages, sendMessages, status };
}

