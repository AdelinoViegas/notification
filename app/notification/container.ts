import { NotificationDispatcher } from "./dispatcher";
import { SSEAdapter } from "./delivery/sse/adapter";

const sseAdapter = new SSEAdapter();

export const notificationDispatcher =
  new NotificationDispatcher(
    new Map([
      ["sse", sseAdapter],
    ])
  );