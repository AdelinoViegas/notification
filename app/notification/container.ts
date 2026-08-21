import { NotificationDispatcher } from "./dispatcher";
import { SSEAdapter } from "./delivery/sse/adapter";
import { NotificationService } from "./service";
import { notificationRepository } from "./persistence/container";

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