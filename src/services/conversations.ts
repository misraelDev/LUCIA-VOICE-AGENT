import conversationsData from "./data/conversations.json";

export interface WhatsAppContact {
  id: string;
  remoteJid: string;
  pushName: string;
  profilePicUrl: string | null;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
}

export const getConversations = async (): Promise<WhatsAppContact[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));
  return conversationsData as WhatsAppContact[];
};
