import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  notificationRepository,
} from "../../../../notification/persistence/container";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message:
            "notification id é obrigatório",
        },
        {
          status: 400,
        }
      );
    }

    await notificationRepository.markAsRead(
      id
    );

    return NextResponse.json(
      {
        message:
          "Notificação marcada como lida",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Erro ao marcar notificação como lida:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Erro ao marcar notificação como lida",
      },
      {
        status: 500,
      }
    );
  }
}