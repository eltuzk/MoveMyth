/**
 * useWebSocket — Generic WebSocket connection management hook.
 *
 * Handles connection lifecycle, reconnection, and message parsing.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions {
  /** WebSocket URL to connect to */
  url: string;
  /** Whether to automatically connect */
  autoConnect?: boolean;
  /** Callback for incoming messages */
  onMessage?: (data: unknown) => void;
  /** Callback on connection open */
  onOpen?: () => void;
  /** Callback on connection close */
  onClose?: () => void;
  /** Callback on error */
  onError?: (error: Event) => void;
}

interface UseWebSocketReturn {
  /** Send a message through the WebSocket */
  sendMessage: (data: unknown) => void;
  /** Current connection status */
  isConnected: boolean;
  /** Manually connect */
  connect: () => void;
  /** Manually disconnect */
  disconnect: () => void;
}

export function useWebSocket({
  url,
  autoConnect = false,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch {
        console.error('[useWebSocket] Failed to parse message:', event.data);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      onClose?.();
    };

    ws.onerror = (error) => {
      console.error('[useWebSocket] Error:', error);
      onError?.(error);
    };

    wsRef.current = ws;
  }, [url, onMessage, onOpen, onClose, onError]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('[useWebSocket] Cannot send — not connected');
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return { sendMessage, isConnected, connect, disconnect };
}
