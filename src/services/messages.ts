import messagesData from "./data/messages.json";

export interface Message {
  id: string;
  key: {
    id: string;
    fromMe: boolean;
    remoteJid: string;
  };
  pushName: string;
  messageType: string;
  message: {
    conversation: string;
    messageContextInfo?: {
      deviceListMetadata?: {
        senderKeyHash: string;
        senderTimestamp: string;
        recipientKeyHash: string;
        recipientTimestamp: string;
      };
      deviceListMetadataVersion: number;
    };
  };
  messageTimestamp: number;
  instanceId: string;
  source: string;
  contextInfo: {
    expiration: number;
    disappearingMode?: {
      initiator: string;
    };
    ephemeralSettingTimestamp: string;
  } | null;
  MessageUpdate: Array<{
    status: string;
  }>;
}

export interface MessagesResponse {
  messages: {
    total: number;
    pages: number;
    currentPage: number;
    records: Message[];
  };
}

interface RawMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation: string;
  };
  messageTimestamp: number;
  pushName: string;
}

export const getMessages = async (
  remoteJid: string,
): Promise<MessagesResponse> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  const allMessages = messagesData as Record<string, RawMessage[]>;
  const contactMessages = allMessages[remoteJid] || [];

  const records: Message[] = contactMessages.map((msg) => ({
    id: msg.key.id,
    key: {
      id: msg.key.id,
      fromMe: msg.key.fromMe,
      remoteJid: msg.key.remoteJid,
    },
    pushName: msg.pushName,
    messageType: "conversation",
    message: {
      conversation: msg.message.conversation,
    },
    messageTimestamp: msg.messageTimestamp,
    instanceId: "demo",
    source: "demo",
    contextInfo: null,
    MessageUpdate: [],
  }));

  return {
    messages: {
      total: records.length,
      pages: 1,
      currentPage: 1,
      records,
    },
  };
};

export async function deleteMessage(
  messageId: string,
  remoteJid: string,
  fromMe: boolean,
) {
  // Simular eliminación
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { success: true, messageId, remoteJid, fromMe };
}
