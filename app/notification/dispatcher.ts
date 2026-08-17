import { NotificationEvent, NotificationDelivery } from "../types";

export class NotificationDispatcher {
  constructor(
    private readonly deliveries: Map<
      NotificationEvent["channel"],
      NotificationDelivery
    >
  ) {}

  async dispatch(
    notification: NotificationEvent
  ): Promise<void> {
    const delivery =
      this.deliveries.get(notification.channel);

    if (!delivery) {
      throw new Error(
        `Nenhum delivery configurado para o canal: ${notification.channel}`
      );
    }

    await delivery.deliver(notification);
  }
}