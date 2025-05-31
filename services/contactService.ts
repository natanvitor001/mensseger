import { IContact } from '@/types/contact';

// Mock data for demonstration
const MOCK_CONTACTS: Record<string, IContact> = {
  'contact1': {
    id: 'contact1',
    name: 'John Doe',
    phoneNumber: '123-456-7890',
    isOnline: true
  },
  'contact2': {
    id: 'contact2',
    name: 'Alice Johnson',
    phoneNumber: '987-654-3210',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  'contact3': {
    id: 'contact3',
    name: 'Bob Smith',
    phoneNumber: '555-123-4567',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  'contact4': {
    id: 'contact4',
    name: 'Emma Wilson',
    phoneNumber: '444-333-2222',
    isOnline: true
  }
};

export async function getContacts(): Promise<IContact[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Object.values(MOCK_CONTACTS).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getContactById(contactId: string): Promise<IContact> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const contact = MOCK_CONTACTS[contactId];
  if (!contact) {
    throw new Error('Contact not found');
  }
  
  return contact;
}

export async function addContact(name: string, phoneNumber: string): Promise<IContact> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check for duplicate phone number
  const existingContact = Object.values(MOCK_CONTACTS).find(
    contact => contact.phoneNumber === phoneNumber
  );
  
  if (existingContact) {
    throw new Error('Contact with this phone number already exists');
  }
  
  const newContact: IContact = {
    id: `contact_${Date.now()}`,
    name,
    phoneNumber,
    isOnline: false
  };
  
  // Add to mock data
  MOCK_CONTACTS[newContact.id] = newContact;
  
  return newContact;
}

export async function updateContact(contactId: string, updates: Partial<IContact>): Promise<IContact> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const contact = MOCK_CONTACTS[contactId];
  if (!contact) {
    throw new Error('Contact not found');
  }
  
  // Update contact
  const updatedContact = {
    ...contact,
    ...updates
  };
  
  // Update mock data
  MOCK_CONTACTS[contactId] = updatedContact;
  
  return updatedContact;
}

export async function deleteContact(contactId: string): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!MOCK_CONTACTS[contactId]) {
    throw new Error('Contact not found');
  }
  
  // Delete from mock data
  delete MOCK_CONTACTS[contactId];
}