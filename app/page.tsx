"use client";

import { useEffect, useState } from "react";
import { Notification, NotificationType } from "./types";
import NotificationItem from "./components/notificationItems";

const RECEIVER = "adelino";

export default function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [form, setForm] = useState({
    recipient: RECEIVER,
    type: "SYSTEM" as NotificationType,
    title: "",
    message: "",
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /*
   * ========================================
   * SSE
   * ========================================
   */

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/notifications/stream?receiver=${encodeURIComponent(RECEIVER)}`
    );

    eventSource.onopen = () => {
      console.log("SSE conectado");
    };

    eventSource.onmessage = (event) => {
      try {
        const notificationEvent = JSON.parse(event.data);

        console.log(
          "Notification Event recebido:",
          notificationEvent
        );

        /*
         * Ignora a mensagem inicial enviada
         * pelo endpoint SSE.
         */
        if (
          notificationEvent.message ===
          "SSE connection established"
        ) {
          return;
        }

        const notification: Notification = {
          id: crypto.randomUUID(),
          type: notificationEvent.type ?? "SYSTEM",
          title: notificationEvent.title ?? "Nova notificação",
          message: notificationEvent.message,
          recipient: notificationEvent.receiver,
          read: false,
          createdAt: new Date(
            notificationEvent.timestamp
          ).toLocaleString("pt-BR"),
        };

        setNotifications((current) => [
          notification,
          ...current,
        ]);
      } catch (error) {
        console.error(
          "Erro ao processar notificação SSE:",
          error
        );
      }
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão SSE:", error);
    };

    return () => {
      console.log("Encerrando conexão SSE");

      eventSource.close();
    };
  }, []);

  /*
   * ========================================
   * DOMAIN EVENT
   * ========================================
   */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !form.recipient.trim() ||
      !form.title.trim() ||
      !form.message.trim()
    ) {
      return;
    }

    const domainEvent = {
      type: form.type,
      source: "notification-playground",

      data: {
        patientId: form.recipient,
        title: form.title,
        message: form.message,
      },

      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "/api/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(domainEvent),
        }
      );

      const data = await response.json();

      console.log(
        "Resposta do Notification Service:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erro ao enviar Domain Event"
        );
      }

      console.log(
        "Domain Event enviado com sucesso!"
      );

      setForm((current) => ({
        ...current,
        title: "",
        message: "",
      }));
    } catch (error) {
      console.error(
        "Erro ao enviar Domain Event:",
        error
      );
    }
  }

  /*
   * ========================================
   * NOTIFICATIONS
   * ========================================
   */

  function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  function removeNotification(id: string) {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-blue-600">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-white">
              Notification Service
            </h1>

            <p className="text-sm text-white">
              Notification playground
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <span className="text-xl">
                🔔
              </span>

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Create Domain Event */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">
                Criar Domain Event
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Simule um evento de negócio.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Recipient */}
              <div>
                <label
                  htmlFor="recipient"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Destinatário
                </label>

                <input
                  id="recipient"
                  type="text"
                  value={form.recipient}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      recipient:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ex: doctor-123"
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Tipo
                </label>

                <select
                  id="type"
                  value={form.type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      type:
                        event.target.value as NotificationType,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="SYSTEM">
                    Sistema
                  </option>

                  <option value="APPOINTMENT_CREATED">
                    Consulta criada
                  </option>

                  <option value="APPOINTMENT_CANCELLED">
                    Consulta cancelada
                  </option>

                  <option value="PATIENT_CREATED">
                    Paciente criado
                  </option>

                  <option value="EXAM_RESULT_AVAILABLE">
                    Resultado de exame
                  </option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Título
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ex: Nova consulta"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mensagem
                </label>

                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      message:
                        event.target.value,
                    })
                  }
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Escreva a mensagem..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
              >
                Enviar Domain Event
              </button>
            </form>
          </section>

          {/* Notifications */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-slate-900">
                    Minhas notificações
                  </h2>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                    {notifications.length}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {unreadCount} não lida
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mb-3 text-4xl">
                    🔔
                  </div>

                  <h3 className="font-medium text-slate-900">
                    Nenhuma notificação
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    As suas notificações aparecerão aqui.
                  </p>
                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markAsRead}
                      onDelete={
                        removeNotification
                      }
                    />
                  )
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}