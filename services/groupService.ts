import { IMessage } from '@/types/chat';

// Mock data for groups
const MOCK_GROUPS: Record<string, any> = {
  'group1': {
    id: 'group1',
    name: 'Team Project',
    members: [
      { id: 'member1', name: 'John Doe', phoneNumber: '123-456-7890' },
      { id: 'member2', name: 'Alice Johnson', phoneNumber: '987-654-3210' },
      { id: 'member3', name: 'Bob Smith', phoneNumber: '555-123-4567' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days ago
  },
  'group2': {
    id: 'group2',
    name: 'Family',
    members: [
      { id: 'member1', name: 'John Doe', phoneNumber: '123-456-7890' },
      { id: 'member4', name: 'Emma Wilson', phoneNumber: '444-333-2222' }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
  }
};

// Mock messages for each group
const MOCK_GROUP_MESSAGES: Record<string, IMessage[]> = {
  'group1': [
    {
      id: '1',
      text: 'Hi everyone!',
      senderId: 'member1',
      senderName: 'John Doe',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      status: 'read'
    },
    {
      id: '2',
      text: 'Hello John!',
      senderId: 'member2',
      senderName: 'Alice Johnson',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4.8).toISOString(), // 4.8 hours ago
      status: 'read'
    },
    {
      id: '3',
      text: 'When is our next meeting?',
      senderId: 'member3',
      senderName: 'Bob Smith',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(), // 4.5 hours ago
      status: 'read'
    },
    {
      id: '4',
      text: 'I think it\'s tomorrow at 3pm',
      senderId: 'currentUser',
      senderName: 'You',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      status: 'read'
    },
    {
      id: '5',
      text: 'Perfect, I\'ll be there',
      senderId: 'member2',
      senderName: 'Alice Johnson',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(), // 2.5 hours ago
      status: 'read'
    },
    {
      id: '6',
      text: 'Meeting at 3pm',
      senderId: 'member1',
      senderName: 'John Doe',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
      status: 'delivered'
    }
  ]
};

export async function getGroupById(groupId: string): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const group = MOCK_GROUPS[groupId];
  if (!group) {
    throw new Error('Group not found');
  }
  
  return group;
}

export async function getGroupMessages(groupId: string): Promise<IMessage[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return MOCK_GROUP_MESSAGES[groupId] || [];
}

export async function sendGroupMessage(groupId: string, text: string): Promise<IMessage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newMessage: IMessage = {
    id: Date.now().toString(),
    text,
    senderId: 'currentUser',
    senderName: 'You',
    createdAt: new Date().toISOString(),
    status: 'sent'
  };
  
  // Update mock data
  if (!MOCK_GROUP_MESSAGES[groupId]) {
    MOCK_GROUP_MESSAGES[groupId] = [];
  }
  
  MOCK_GROUP_MESSAGES[groupId].push(newMessage);
  
  // Simulate message being delivered after a delay
  setTimeout(() => {
    if (MOCK_GROUP_MESSAGES[groupId]) {
      const messageIndex = MOCK_GROUP_MESSAGES[groupId].findIndex(msg => msg.id === newMessage.id);
      if (messageIndex !== -1) {
        MOCK_GROUP_MESSAGES[groupId][messageIndex].status = 'delivered';
      }
    }
  }, 1000);
  
  return newMessage;
}

export async function updateGroupName(groupId: string, name: string): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const group = MOCK_GROUPS[groupId];
  if (!group) {
    throw new Error('Group not found');
  }
  
  // Update group
  const updatedGroup = {
    ...group,
    name
  };
  
  // Update mock data
  MOCK_GROUPS[groupId] = updatedGroup;
  
  return updatedGroup;
}

export async function addGroupMembers(groupId: string, memberIds: string[]): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const group = MOCK_GROUPS[groupId];
  if (!group) {
    throw new Error('Group not found');
  }
  
  // In a real app, this would fetch member info from a database
  const newMembers = memberIds.map(id => ({
    id,
    name: `User ${id}`,
    phoneNumber: `555-${id.padStart(3, '0')}-${id.padStart(4, '0')}`
  }));
  
  // Update group
  const updatedGroup = {
    ...group,
    members: [...group.members, ...newMembers]
  };
  
  // Update mock data
  MOCK_GROUPS[groupId] = updatedGroup;
  
  return updatedGroup;
}

export async function removeGroupMember(groupId: string, memberId: string): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const group = MOCK_GROUPS[groupId];
  if (!group) {
    throw new Error('Group not found');
  }
  
  // Update group
  const updatedGroup = {
    ...group,
    members: group.members.filter((member: any) => member.id !== memberId)
  };
  
  // Update mock data
  MOCK_GROUPS[groupId] = updatedGroup;
  
  return updatedGroup;
}

export async function deleteGroup(groupId: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (!MOCK_GROUPS[groupId]) {
    throw new Error('Group not found');
  }
  
  // Delete from mock data
  delete MOCK_GROUPS[groupId];
  delete MOCK_GROUP_MESSAGES[groupId];
}