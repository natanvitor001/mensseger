// Definições de tipos para a aplicação

export type UserRole = 'customer' | 'provider' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'blocked';
export type AdminLevel = 'super' | 'marketing' | 'design' | 'support';
export type AdminPermission = 'all' | 'users' | 'marketing' | 'appearance' | 'content';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  location?: {
    city: string;
    state: string;
  };
  phone?: string;
  createdAt: Date;
  status?: UserStatus;
}

export interface Admin extends User {
  role: 'admin';
  password: string;
  level: AdminLevel;
  permissions: AdminPermission[];
}

export interface Provider extends User {
  role: 'provider';
  bio: string;
  skills: string[];
  averageRating: number;
  reviewCount: number;
  completedJobs: number;
  categories: string[];
  portfolio: PortfolioItem[];
  availability: boolean;
  credits: number;
  status?: UserStatus;
}

export interface Customer extends User {
  role: 'customer';
  requestsCreated: number;
  status?: UserStatus;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: {
    city: string;
    state: string;
  };
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
  quotes: Quote[];
  customerContact?: {
    email: string;
    phone: string;
  };
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  price: number;
  description: string;
  estimatedTime: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  requestId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface PortfolioItem {
  id: string;
  providerId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}