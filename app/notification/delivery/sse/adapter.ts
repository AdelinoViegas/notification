import { NotificationDelivery, NotificationEvent } from "../../../types";
import { sseConnectionManager } from "./container";

export class SSEAdapter implements NotificationDelivery {
  async deliver(
    notification: NotificationEvent
  ): Promise<void> {
    const connections =
      sseConnectionManager.getConnections(
        notification.receiver
      );

    if (connections.size === 0) {
      console.log(
        `Nenhuma conexão SSE encontrada para: ${notification.receiver}`
      );

      return;
    }

    for (const connection of connections) {
      await connection.send(
        JSON.stringify(notification)
      );
    }
  }
}