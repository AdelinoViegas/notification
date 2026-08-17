// src/notification/services/notification.service.ts

import { DomainEvent , NotificationEvent } from "../types";

export class NotificationService {

  process(event: DomainEvent): NotificationEvent[] {

    // 1. Validar evento
    this.validate(event);

    // 2. Aplicar regras de negócio
    const receivers = this.determineReceivers(event);

    // 3. Construir notificações
    return receivers.map((receiver) =>
      this.createNotification(event, receiver)
    );
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
      source: event.source,
      sender: event.source,
      receiver,
      channel: "sse",
      message: this.buildMessage(event),
      timestamp: new Date().toISOString(),
    };
  }

  private buildMessage(event: DomainEvent): string {
    return `Novo evento recebido: ${event.type}`;
  }
}