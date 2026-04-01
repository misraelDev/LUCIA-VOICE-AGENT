import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { WS_URL } from "@/config/env";

export interface WebSocketMessage {
  type: "new" | "updated";
  data: unknown;
}

// Tipo para las solicitudes basado en la estructura del backend
export interface RequestData {
  id: number;
  name: string;
  email: string;
  phone: string;
  need: string;
  status: string;
  submittedAt: string;
  message?: string;
  referralCode?: string;
  sellerId?: string;
}

// Tipo para los usuarios
export interface UserData {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  created_at: string;
  email_confirmed: boolean;
}

class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private isConnecting = false;
  private pendingSubscriptions = new Map<
    string,
    (message: WebSocketMessage) => void
  >();
  private activeSubscriptions = new Map<
    string,
    (message: WebSocketMessage) => void
  >();

  connect() {
    // Evitar múltiples conexiones simultáneas
    if (this.isConnected || this.isConnecting) {
      return;
    }

    if (!WS_URL) {
      return;
    }

    this.isConnecting = true;
    const token = localStorage.getItem("access_token");

    // Usar SockJS para compatibilidad con el backend Spring
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      debug: () => {
        // Debug deshabilitado
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.isConnected = true;
      this.isConnecting = false;

      // Usar setTimeout para asegurar que la conexión STOMP esté completamente lista
      setTimeout(() => {
        // Suscribir todas las suscripciones pendientes
        this.pendingSubscriptions.forEach((callback, topic) => {
          this.doSubscribe(topic, callback);
        });
        this.pendingSubscriptions.clear();
      }, 100);
    };

    this.client.onDisconnect = () => {
      this.isConnected = false;
      this.isConnecting = false;
      // Mover suscripciones activas a pendientes para reconexión
      this.activeSubscriptions.forEach((callback, topic) => {
        this.pendingSubscriptions.set(topic, callback);
      });
      this.activeSubscriptions.clear();
    };

    this.client.onStompError = () => {
      this.isConnecting = false;
    };

    this.client.onWebSocketError = () => {
      this.isConnecting = false;
    };

    this.client.onWebSocketClose = () => {
      this.isConnecting = false;
    };

    try {
      this.client.activate();
    } catch {
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.isConnecting = false;
    }
  }

  private doSubscribe(
    topic: string,
    callback: (message: WebSocketMessage) => void,
  ) {
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      this.client.subscribe(topic, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback({
            type: topic.includes("new") ? "new" : "updated",
            data,
          });
        } catch {
          // Error silencioso al parsear mensaje
        }
      });
      this.activeSubscriptions.set(topic, callback);
    } catch {
      // Error silencioso al suscribirse
    }
  }

  subscribe(topic: string, callback: (message: WebSocketMessage) => void) {
    if (!this.client || !this.isConnected) {
      // Guardar la suscripción para cuando se conecte
      this.pendingSubscriptions.set(topic, callback);
      return;
    }

    this.doSubscribe(topic, callback);
  }

  unsubscribe(topic: string) {
    this.pendingSubscriptions.delete(topic);
    this.activeSubscriptions.delete(topic);
  }

  // Métodos específicos para solicitudes
  subscribeToNewRequests(callback: (request: RequestData) => void) {
    this.subscribe("/topic/requests/new", (message) => {
      callback(message.data as RequestData);
    });
  }

  subscribeToUpdatedRequests(callback: (request: RequestData) => void) {
    this.subscribe("/topic/requests/updated", (message) => {
      callback(message.data as RequestData);
    });
  }

  subscribeToRequests(callbacks: {
    onNew?: (request: RequestData) => void;
    onUpdated?: (request: RequestData) => void;
  }) {
    if (callbacks.onNew) {
      this.subscribeToNewRequests(callbacks.onNew);
    }
    if (callbacks.onUpdated) {
      this.subscribeToUpdatedRequests(callbacks.onUpdated);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      client: this.client ? "active" : "null",
    };
  }

  // Métodos específicos para usuarios
  subscribeToNewUsers(callback: (user: UserData) => void) {
    this.subscribe("/topic/users/new", (message) => {
      callback(message.data as UserData);
    });
  }

  subscribeToUsersConsulted(callback: (users: UserData[]) => void) {
    this.subscribe("/topic/users/consulted", (message) => {
      callback(message.data as UserData[]);
    });
  }

  subscribeToUserConsulted(callback: (user: UserData) => void) {
    this.subscribe("/topic/user/consulted", (message) => {
      callback(message.data as UserData);
    });
  }

  subscribeToUsers(callbacks: {
    onNew?: (user: UserData) => void;
    onConsulted?: (users: UserData[]) => void;
    onUserConsulted?: (user: UserData) => void;
  }) {
    if (callbacks.onNew) {
      this.subscribeToNewUsers(callbacks.onNew);
    }
    if (callbacks.onConsulted) {
      this.subscribeToUsersConsulted(callbacks.onConsulted);
    }
    if (callbacks.onUserConsulted) {
      this.subscribeToUserConsulted(callbacks.onUserConsulted);
    }
  }
}

// Exportar una instancia singleton
export const webSocketService = new WebSocketService();
export default webSocketService;
