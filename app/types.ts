export type NotificationType =
  | "APPOINTMENT_CREATED"
  | "APPOINTMENT_CANCELLED"
  | "PATIENT_CREATED"
  | "EXAM_RESULT_AVAILABLE"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipient: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

///Testes

//saida para esse tipo de tipagem DomainEvent
/*
{
  "type": "APPOINTMENT_CREATED",
  "source": "appointment-service",
  "data": {
    "patientId": "patient-123",
    "doctorId": "doctor-456",
    "appointmentId": "appointment-789"
  },
  "timestamp": "2026-08-15T11:30:00.000Z"
}*/

/*export type NotificationChannel =
  | "sse"
  | "websocket"
  | "email"
  | "sms";
*/
// src/notification/domain/notification-event.ts



export interface DomainEvent {
  type: string;
  source: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export type NotificationChannel = "sse";

export interface NotificationEvent {
  id?: string;
  source: string;
  sender: string;
  receiver: string;
  channel: NotificationChannel;
  message?: string;
  type?: string;
  title?: string;
  data?: Record<string, unknown>;
  read?: boolean;
  reatAt?: Date;
  createdAt?: Date;
  timestamp: string
}

export interface NotificationDelivery {
  deliver(notification: NotificationEvent): Promise<void>;
}

//sse-connection
export interface SSEConnection {
  send(data: string): Promise<void>;
  close(): void;
}