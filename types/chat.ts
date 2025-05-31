export interface IMessage {
  id: string;
  text: string;
  senderId: string;
  senderName?: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: IAttachment[];
}

export interface IAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  name?: string;
  size?: number;
}

export interface IChatPreview {
  id: string;
  name: string;
  isGroup: boolean;
  avatarUrl?: string;
  lastMessage?: {
    text: string;
    createdAt: string;
    isOwnMessage: boolean;
    status?: 'sent' | 'delivered' | 'read';
  };
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: string;
}