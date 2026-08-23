import { DomainEvent , NotificationEvent } from "../types";
import { NotificationRepository } from "./persistence/repository";

export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async process(event: DomainEvent): Promise<NotificationEvent[]> {
    // 1. Validar evento
    this.validate(event);

    // 2. Aplicar regras de negócio
    const receivers = this.determineReceivers(event);

    // 3. Construir notificações
    const notifications = receivers.map((receiver) =>
      this.createNotification(event, receiver)
    );

    // 4. Persistir notificações
    for (const notification of notifications) {
      await this.notificationRepository.create(notification);
    }

    // 5. Retornar notificações para o Dispatcher
    return notifications;
  }

  private validate(event: DomainEvent): void {
    if (!event.type) {
      throw new Error("Domain Event type é obrigatório");
    }

    if (!event.source) {
      throw new Error("Domain Event source é obrigatório");
    }

    if (!event.timestamp) {
      throw new Error("Domain Event timestamp é obrigatório");
    }
  }

  private determineReceivers(event: DomainEvent): string[] {
    // Por enquanto apenas exemplo.
    // As regras reais serão definidas posteriormente.

    const patientId = event.data.patientId;

    if (typeof patientId !== "string") {
      return [];
    }

    return [patientId];
  }

  private createNotification(
    event: DomainEvent,
    receiver: string
  ): NotificationEvent {

    return {
      id: crypto.randomUUID(),
      source: event.source,
      sender: event.source,
      receiver,
      channel: "sse",
      message: this.buildMessage(event),
      type: event.type,
      data: event.data,
      read: false,
      timestamp: new Date().toISOString(),
    };
  }

  private buildMessage(event: DomainEvent): string {
    return `Novo evento recebido: ${event.type}`;
  }
}