import { NotificationDispatcher } from "./dispatcher";
import { SSEAdapter } from "./delivery/sse/adapter";
import { NotificationService } from "./service";
import { MongoNotificationRepository } from "./persistence/db";

// Repository
const notificationRepository =
  new MongoNotificationRepository();

// SSE
const sseAdapter = new SSEAdapter();

// Dispatcher
export const notificationDispatcher =
  new NotificationDispatcher(
    new Map([
      ["sse", sseAdapter],
    ])
  );

// Service
export const notificationService =
  new NotificationService(
    notificationRepository
  );