import { NextRequest } from "next/server";
import { sseConnectionManager } from "../../../notification/delivery/sse/container";
import { SSEConnection } from "../../../types";

export async function GET(request: NextRequest) {
  const receiver =
    request.nextUrl.searchParams.get("receiver");

  if (!receiver) {
    return new Response(
      JSON.stringify({
        message: "receiver é obrigatório",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const encoder = new TextEncoder();

  let connection: SSEConnection;

  const stream = new ReadableStream({
    start(controller) {
      connection = {
        send: async (data: string) => {
          const message =
            `data: ${data}\n\n`;

          controller.enqueue(
            encoder.encode(message)
          );
        },

        close: () => {
          controller.close();
        },
      };

      sseConnectionManager.addConnection(
        receiver,
        connection
      );

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            message: "SSE connection established",
          })}\n\n`
        )
      );
    },

    cancel() {
      sseConnectionManager.removeConnection(
        receiver,
        connection
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}