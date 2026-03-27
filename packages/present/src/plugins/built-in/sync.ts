/**
 * Sync plugin — WebSocket-based real-time sync for multi-device presentations
 */

import type { Plugin, PluginContext } from "../types";
import type { DeckEvent } from "../../types";

/** Sync plugin options */
export interface SyncOptions {
  /** WebSocket server URL */
  serverUrl: string;
  /** Room ID */
  roomId: string;
  /** Presenter token (for controlling) */
  presenterToken?: string;
  /** Reconnect on disconnect */
  autoReconnect: boolean;
  /** Reconnect delay in ms */
  reconnectDelay: number;
  /** Max reconnect attempts */
  maxReconnectAttempts: number;
  /** On connection state change */
  onConnectionChange?: (connected: boolean) => void;
  /** On error */
  onError?: (error: Error) => void;
}

const DEFAULT_OPTIONS: SyncOptions = {
  serverUrl: "wss://sync.example.com",
  roomId: "",
  autoReconnect: true,
  reconnectDelay: 2000,
  maxReconnectAttempts: 5,
};

/** Sync message types */
interface SyncMessage {
  type: "event" | "state" | "ping" | "pong" | "join" | "leave" | "auth";
  payload: unknown;
  sender: string;
  timestamp: number;
}

/**
 * Create sync plugin
 */
export function createSyncPlugin(options: Partial<SyncOptions> = {}): Plugin {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let context: PluginContext | null = null;
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  let isConnected = false;
  let clientId = generateClientId();

  function connect(): void {
    if (socket?.readyState === WebSocket.OPEN) return;

    try {
      socket = new WebSocket(`${config.serverUrl}?room=${config.roomId}`);

      socket.onopen = () => {
        isConnected = true;
        reconnectAttempts = 0;
        config.onConnectionChange?.(true);

        // Join room
        send({
          type: "join",
          payload: { roomId: config.roomId, clientId },
          sender: clientId,
          timestamp: Date.now(),
        });

        // Authenticate if presenter
        if (config.presenterToken) {
          send({
            type: "auth",
            payload: { token: config.presenterToken },
            sender: clientId,
            timestamp: Date.now(),
          });
        }
      };

      socket.onmessage = (event) => {
        try {
          const message: SyncMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error("[Sync] Failed to parse message:", error);
        }
      };

      socket.onclose = () => {
        isConnected = false;
        config.onConnectionChange?.(false);

        if (config.autoReconnect && reconnectAttempts < config.maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connect, config.reconnectDelay);
        }
      };

      socket.onerror = (error) => {
        console.error("[Sync] WebSocket error:", error);
        config.onError?.(new Error("WebSocket error"));
      };
    } catch (error) {
      console.error("[Sync] Failed to connect:", error);
      config.onError?.(error as Error);
    }
  }

  function disconnect(): void {
    if (socket) {
      socket.close();
      socket = null;
    }
  }

  function send(message: SyncMessage): void {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  function handleMessage(message: SyncMessage): void {
    // Ignore own messages
    if (message.sender === clientId) return;

    switch (message.type) {
      case "event":
        // Apply remote event
        const event = message.payload as DeckEvent;
        context?.dispatch(event);
        break;

      case "state":
        // Sync state from remote
        break;

      case "ping":
        // Respond with pong
        send({
          type: "pong",
          payload: {},
          sender: clientId,
          timestamp: Date.now(),
        });
        break;
    }
  }

  return {
    config: {
      name: "sync",
      version: "1.0.0",
      description: "Real-time sync for multi-device presentations",
      options: config,
    },
    hooks: {
      onRegister: (ctx) => {
        context = ctx;
        connect();
      },

      onUnregister: () => {
        send({
          type: "leave",
          payload: { roomId: config.roomId, clientId },
          sender: clientId,
          timestamp: Date.now(),
        });
        disconnect();
        context = null;
      },

      onEvent: (event: DeckEvent) => {
        // Broadcast local events to other clients
        send({
          type: "event",
          payload: event,
          sender: clientId,
          timestamp: Date.now(),
        });
      },
    },
  };
}

function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}