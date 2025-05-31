import { IChatPreview, IMessage } from '@/types/chat';

// Mock data for demonstration
const MOCK_CHATS: Record<string, IChatPreview> = {
  'chat1': {
    id: 'chat1',
    name: 'John Doe',
    isGroup: false,
    lastMessage: {
      text: 'Hey, how are you doing?',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      isOwnMessage: false,
      status: 'read'
    },
    unreadCount: 1,
    isOnline: true
  },
  'chat2': {
    id: 'chat2',
    name: 'Alice Johnson',
    isGroup: false,
    lastMessage: {
      text: 'See you tomorrow!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isOwnMessage: true,
      status: 'read'
    },
    unreadCount: 0,
    isOnline: false
  },
  'chat3': {
    id: 'chat3',
    name: 'Team Project',
    isGroup: true,
    lastMessage: {
      text: 'Meeting at 3pm',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isOwnMessage: false,
      status: 'delivered'
    },
    unreadCount: 3,
    isOnline: false
  }
};

// Mock messages for each chat
const MOCK_MESSAGES: Record<string, IMessage[]> = {
  'chat1': [
    {
      id: '1',
      text: 'Hi there!',
      senderId: 'user1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: 'read'
    },
    {
      id: '2',
      text: 'Hello! How are you?',
      senderId: 'currentUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
      status: 'read'
    },
    {
      id: '3',
      text: 'I\'m good, thanks! Just working on our app.',
      senderId: 'user1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
      status: 'read'
    },
    {
      id: '4',
      text: 'That sounds great! Need any help?',
      senderId: 'currentUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: 'read'
    },
    {
      id: '5',
      text: 'Hey, how are you doing?',
      senderId: 'user1',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      status: 'delivered'
    }
  ],
  'chat2': [
    {
      id: '1',
      text: 'Are we still meeting tomorrow?',
      senderId: 'user2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      status: 'read'
    },
    {
      id: '2',
      text: 'Yes, at the coffee shop on Main St.',
      senderId: 'currentUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(), // 2.5 hours ago
      status: 'read'
    },
    {
      id: '3',
      text: 'Perfect! What time?',
      senderId: 'user2',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.2).toISOString(), // 2.2 hours ago
      status: 'read'
    },
    {
      id: '4',
      text: 'How about 10am?',
      senderId: 'currentUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.1).toISOString(), // 2.1 hours ago
      status: 'read'
    },
    {
      id: '5',
      text: 'See you tomorrow!',
      senderId: 'currentUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: 'read'
    }
  ]
};

export async function getRecentChats(): Promise<IChatPreview[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Object.values(MOCK_CHATS);
}

export async function getChatById(chatId: string): Promise<IChatPreview> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const chat = MOCK_CHATS[chatId];
  if (!chat) {
    throw new Error('Chat not found');
  }
  
  return chat;
}

export async function getMessages(chatId: string): Promise<IMessage[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const messages = MOCK_MESSAGES[chatId] || [];
  
  // Update unread messages to read status
  if (MOCK_CHATS[chatId]) {
    MOCK_CHATS[chatId].unreadCount = 0;
  }
  
  return messages;
}

export async function sendMessage(chatId: string, text: string): Promise<IMessage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newMessage: IMessage = {
    id: Date.now().toString(),
    text,
    senderId: 'currentUser',
    createdAt: new Date().toISOString(),
    status: 'sent'
  };
  
  // Update mock data
  if (!MOCK_MESSAGES[chatId]) {
    MOCK_MESSAGES[chatId] = [];
  }
  
  MOCK_MESSAGES[chatId].push(newMessage);
  
  if (MOCK_CHATS[chatId]) {
    MOCK_CHATS[chatId].lastMessage = {
      text,
      createdAt: newMessage.createdAt,
      isOwnMessage: true,
      status: 'sent'
    };
  }
  
  // Simulate message being delivered after a delay
  setTimeout(() => {
    if (MOCK_MESSAGES[chatId]) {
      const messageIndex = MOCK_MESSAGES[chatId].findIndex(msg => msg.id === newMessage.id);
      if (messageIndex !== -1) {
        MOCK_MESSAGES[chatId][messageIndex].status = 'delivered';
        
        if (MOCK_CHATS[chatId]?.lastMessage?.isOwnMessage) {
          MOCK_CHATS[chatId].lastMessage.status = 'delivered';
        }
      }
    }
  }, 1000);
  
  return newMessage;
}

export async function createChat(contactId: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would create a new chat with the contact
  // For demo, we'll just return a chat ID
  const chatId = `chat_${Date.now()}`;
  
  // Add to mock data
  MOCK_CHATS[chatId] = {
    id: chatId,
    name: 'New Contact',
    isGroup: false,
    unreadCount: 0,
    isOnline: false
  };
  
  return chatId;
}

export async function createGroupChat(name: string, memberIds: string[]): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would create a new group chat
  // For demo, we'll just return a group ID
  const groupId = `group_${Date.now()}`;
  
  // Add to mock data
  MOCK_CHATS[groupId] = {
    id: groupId,
    name,
    isGroup: true,
    unreadCount: 0,
    isOnline: false
  };
  
  return groupId;
}