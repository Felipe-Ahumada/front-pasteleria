import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common";
import {
  CONTACT_MESSAGES_EVENT,
  contactMessageService,
} from "@/service/contactMessageService";
import type { ContactMessage } from "@/types/contactMessage";

type StatusFilter = "todos" | "pendientes" | "leidos";

const CommentsPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  useEffect(() => {
    const syncMessages = (_event?: Event) => {
      setMessages(contactMessageService.getAll());
    };

    syncMessages();

    if (typeof window === "undefined") {
      return () => undefined;
    }

    window.addEventListener(CONTACT_MESSAGES_EVENT, syncMessages);
    return () => {
      window.removeEventListener(CONTACT_MESSAGES_EVENT, syncMessages);
    };
  }, []);

  const pendingCount = useMemo(
    () => messages.filter((message) => !message.leido).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return messages
      .filter((message) => {
        if (statusFilter === "pendientes") return !message.leido;
        if (statusFilter === "leidos") return Boolean(message.leido);
        return true;
      })
      .filter((message) => {
        if (!normalizedSearch) return true;
        return (
          message.nombre.toLowerCase().includes(normalizedSearch) ||
          message.correo.toLowerCase().includes(normalizedSearch) ||
          message.comentario.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
  }, [messages, search, statusFilter]);

  const handleToggleRead = useCallback((messageId: string) => {
    setMessages(contactMessageService.toggleRead(messageId));
  }, []);

  const handleReply = useCallback((message: ContactMessage) => {
    const subject = encodeURIComponent("Respuesta desde Pastelería Mil Sabores");
    const greeting = `Hola ${message.nombre},\n\n`;
    const original = `En relación a tu mensaje:\n"${message.comentario}"\n\n`;
    const signature = "Saludos,\nEquipo Pastelería Mil Sabores";
    const body = encodeURIComponent(`${greeting}${original}${signature}`);

    const mailtoUrl = `mailto:${message.correo}?subject=${subject}&body=${body}`;

    window.open(mailtoUrl, "_blank", "noopener,noreferrer");

    if (!message.leido) {
      setMessages(contactMessageService.toggleRead(message.id));
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setMessages(contactMessageService.getAll());
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Mensajes de Contáctanos</h2>
          <p className="text-muted mb-0 small">
            {pendingCount === 1
              ? "1 mensaje pendiente por revisar"
              : `${pendingCount} mensajes pendientes por revisar`}
          </p>
        </div>
        <Button variant="mint" size="sm" onClick={handleRefresh}>
          Actualizar listado
        </Button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Buscar por nombre, correo o comentario</label>
          <input
            className="form-control"
            placeholder="Ej: Ana, ventas@duoc.cl, felicitaciones..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="todos">Todos</option>
            <option value="pendientes">Solo pendientes</option>
            <option value="leidos">Solo leídos</option>
          </select>
        </div>
      </div>

      <div className="table-responsive shadow-sm">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Comentario</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((message) => (
              <tr key={message.id}>
                <td className="fw-semibold">{message.nombre}</td>
                <td>{message.correo}</td>
                <td className="text-break" style={{ maxWidth: "420px" }}>
                  {message.comentario}
                </td>
                <td>
                  {new Date(message.fecha).toLocaleString("es-CL", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td>
                  <span
                    className={`badge ${
                      message.leido ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {message.leido ? "Leído" : "Pendiente"}
                  </span>
                </td>
                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="mint"
                      size="sm"
                      onClick={() => handleToggleRead(message.id)}
                    >
                      {message.leido ? "Marcar como pendiente" : "Marcar como leído"}
                    </Button>
                    <Button
                      variant="strawberry"
                      size="sm"
                      onClick={() => handleReply(message)}
                    >
                      Responder por correo
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredMessages.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No se encontraron mensajes con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommentsPage;
