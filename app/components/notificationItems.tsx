import { NotificationItemProps } from "../types";

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
}: NotificationItemProps) {
  return (
    <article
      className={`group px-6 py-5 transition ${
        !notification.read
          ? "bg-blue-50/40"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            !notification.read
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          🔔
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-sm font-semibold ${
                    !notification.read
                      ? "text-slate-900"
                      : "text-slate-700"
                  }`}
                >
                  {notification.title}
                </h3>

                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {notification.message}
              </p>
            </div>

            <span className="shrink-0 text-xs text-slate-400">
              {notification.createdAt}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-4">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onRead(notification.id)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Marcar como lida
              </button>
            )}

            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="text-xs font-medium text-slate-500 hover:text-red-600"
            >
              Excluir
            </button>

            <span className="text-xs text-slate-400">
              {notification.type}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}