// Mock authentication service for demo purposes
// In a real app, this would be replaced with actual API calls

interface User {
  id: string;
  name: string;
  phoneNumber: string;
}

// Simulated user database
const USERS: Record<string, User & { password: string }> = {
  '1': {
    id: '1',
    name: 'John Doe',
    phoneNumber: '123-456-7890',
    password: 'password123'
  },
  '2': {
    id: '2',
    name: 'Jane Smith',
    phoneNumber: '987-654-3210',
    password: 'password123'
  }
};

export async function mockSignIn(phoneNumber: string, password: string): Promise<User> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user by phone number
  const user = Object.values(USERS).find(u => u.phoneNumber === phoneNumber);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function mockSignUp(phoneNumber: string, password: string, name: string): Promise<User> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = Object.values(USERS).find(u => u.phoneNumber === phoneNumber);
  
  if (existingUser) {
    throw new Error('Phone number already registered');
  }
  
  // Create new user
  const newUserId = Date.now().toString();
  const newUser = {
    id: newUserId,
    name,
    phoneNumber,
    password
  };
  
  // Add to "database"
  USERS[newUserId] = newUser;
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function mockSignOut(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would invalidate tokens, etc.
  return;
}