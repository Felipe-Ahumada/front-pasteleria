import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import { readArray, writeJSON } from "@/utils/storage/localStorageUtils";
import type { ContactMessage } from "@/types/contactMessage";

const STORAGE_KEY = LOCAL_STORAGE_KEYS.contactMessages;

export const CONTACT_MESSAGES_EVENT = "contact-messages:update" as const;

type StoredContactMessage = Omit<ContactMessage, "id"> & { id?: string };

const saveMessages = (messages: ContactMessage[]) => {
  writeJSON(STORAGE_KEY, messages);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONTACT_MESSAGES_EVENT));
  }
};

const generateFallbackId = (index: number, seed?: string) => {
  const base = seed ?? `${Date.now()}`;
  return `legacy-contact-${base}-${index}`;
};

const normalizeMessages = (
  messages: StoredContactMessage[]
): ContactMessage[] => {
  let requiresPersist = false;

  const normalized = messages.map((message, index) => {
    if (!message.id) {
      requiresPersist = true;
    }

    return {
      id: message.id ?? generateFallbackId(index, message.fecha),
      nombre: message.nombre ?? "",
      correo: message.correo ?? "",
      comentario: message.comentario ?? "",
      fecha: message.fecha ?? new Date().toISOString(),
      leido: message.leido ?? false,
    } satisfies ContactMessage;
  });

  if (requiresPersist) {
    saveMessages(normalized);
  }

  return normalized;
};

const loadMessages = (): ContactMessage[] => {
  const raw = readArray<StoredContactMessage>(STORAGE_KEY);
  if (!raw.length) {
    return [];
  }
  return normalizeMessages(raw);
};

export const contactMessageService = {
  getAll(): ContactMessage[] {
    return loadMessages();
  },

  add(message: ContactMessage) {
    const messages = loadMessages();
    messages.push(message);
    saveMessages(messages);
  },

  toggleRead(messageId: string) {
    const updated = loadMessages().map((message) =>
      message.id === messageId
        ? { ...message, leido: !message.leido }
        : message
    );

    saveMessages(updated);
    return updated;
  },

  remove(messageId: string) {
    const updated = loadMessages().filter((message) => message.id !== messageId);
    saveMessages(updated);
    return updated;
  },

  countUnread() {
    return loadMessages().filter((message) => !message.leido).length;
  },
};
