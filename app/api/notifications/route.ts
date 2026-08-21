import { NextRequest, NextResponse } from "next/server";
import { DomainEvent } from "../../types";
import {
  notificationService,
  notificationDispatcher
} from "../../notification/container";

import {
  notificationRepository,
} from "../../notification/persistence/container";

export async function POST(
  request: NextRequest
) {
  try {
    const event: DomainEvent = await request.json();

    const notifications = await notificationService.process(event);

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

export async function GET(
  request: NextRequest
) {
  try {
    const receiver =
      request.nextUrl.searchParams.get(
        "receiver"
      );

    if (!receiver) {
      return NextResponse.json(
        {
          message:
            "receiver é obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    const notifications = await notificationRepository.findUnreadByReceiver(receiver);

    return NextResponse.json(
      {
        notifications,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao buscar notificações:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Erro ao buscar notificações",
      },
      {
        status: 500,
      }
    );
  }
}