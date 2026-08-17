// app/api/notifications/route.ts

import { NextRequest, NextResponse } from "next/server";
import { DomainEvent } from "../../types";
import { NotificationService } from "../../notification/service";
import { notificationDispatcher } from "../../notification/container";

const notificationService = new NotificationService();

export async function POST(
  request: NextRequest
) {
  try {
    const event: DomainEvent =
      await request.json();

    const notifications =
      notificationService.process(event);

    for (const notification of notifications) {
      await notificationDispatcher.dispatch(
        notification
      );
    }

    return NextResponse.json(
      {
        message:
          "Domain Event processado com sucesso",
        notifications,
      },
      {
        status: 202,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao processar Domain Event:",
      error
    );

    return NextResponse.json(
      {
        message: "Payload inválido",
      },
      {
        status: 400,
      }
    );
  }
}