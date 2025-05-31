import { Category, Provider, Customer, ServiceRequest, Review } from '../types';

// Mock Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Home Repair',
    icon: 'tool',
    description: 'Find professionals for all your home repair needs',
    subcategories: [
      { id: '101', name: 'Plumbing', categoryId: '1' },
      { id: '102', name: 'Electrical', categoryId: '1' },
      { id: '103', name: 'Carpentry', categoryId: '1' },
      { id: '104', name: 'Painting', categoryId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Technology',
    icon: 'cpu',
    description: 'Technical support and IT services',
    subcategories: [
      { id: '201', name: 'Computer Repair', categoryId: '2' },
      { id: '202', name: 'Network Setup', categoryId: '2' },
      { id: '203', name: 'Software Installation', categoryId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Beauty & Wellness',
    icon: 'scissors',
    description: 'Services for personal care and wellness',
    subcategories: [
      { id: '301', name: 'Haircut', categoryId: '3' },
      { id: '302', name: 'Massage', categoryId: '3' },
      { id: '303', name: 'Manicure', categoryId: '3' },
    ],
  },
  {
    id: '4',
    name: 'Education',
    icon: 'book',
    description: 'Private lessons and tutoring services',
    subcategories: [
      { id: '401', name: 'Math Tutoring', categoryId: '4' },
      { id: '402', name: 'Language Learning', categoryId: '4' },
      { id: '403', name: 'Music Lessons', categoryId: '4' },
    ],
  },
  {
    id: '5',
    name: 'Events',
    icon: 'calendar',
    description: 'Event planning and coordination services',
    subcategories: [
      { id: '501', name: 'Photography', categoryId: '5' },
      { id: '502', name: 'Catering', categoryId: '5' },
      { id: '503', name: 'DJ Services', categoryId: '5' },
    ],
  },
];

// Mock Providers
export const providers: Provider[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'provider',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    location: { city: 'New York', state: 'NY' },
    phone: '(123) 456-7890',
    createdAt: new Date('2023-01-15'),
    bio: 'Professional plumber with over 10 years of experience in residential and commercial settings.',
    skills: ['Plumbing Repair', 'Installation', 'Maintenance'],
    averageRating: 4.8,
    reviewCount: 56,
    completedJobs: 78,
    categories: ['Home Repair'],
    portfolio: [
      {
        id: 'port1',
        providerId: 'p1',
        title: 'Bathroom Renovation',
        description: 'Complete plumbing overhaul for a master bathroom',
        imageUrl: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg',
        createdAt: new Date('2023-05-20'),
      },
    ],
    availability: true,
  },
  {
    id: 'p2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    role: 'provider',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    location: { city: 'Los Angeles', state: 'CA' },
    phone: '(456) 789-0123',
    createdAt: new Date('2023-02-20'),
    bio: 'Certified IT technician specializing in network setup and troubleshooting.',
    skills: ['Network Setup', 'Troubleshooting', 'System Administration'],
    averageRating: 4.9,
    reviewCount: 42,
    completedJobs: 50,
    categories: ['Technology'],
    portfolio: [
      {
        id: 'port2',
        providerId: 'p2',
        title: 'Office Network Setup',
        description: 'Complete network infrastructure for a small business',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
        createdAt: new Date('2023-06-15'),
      },
    ],
    availability: true,
  },
  {
    id: 'p3',
    name: 'David Johnson',
    email: 'david@example.com',
    role: 'provider',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    location: { city: 'Chicago', state: 'IL' },
    phone: '(789) 012-3456',
    createdAt: new Date('2023-03-10'),
    bio: 'Professional painter with attention to detail and quality finishes.',
    skills: ['Interior Painting', 'Exterior Painting', 'Color Consultation'],
    averageRating: 4.7,
    reviewCount: 38,
    completedJobs: 45,
    categories: ['Home Repair'],
    portfolio: [
      {
        id: 'port3',
        providerId: 'p3',
        title: 'Living Room Transformation',
        description: 'Complete interior painting project',
        imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        createdAt: new Date('2023-07-05'),
      },
    ],
    availability: true,
  },
];

// Mock Customers
export const customers: Customer[] = [
  {
    id: 'c1',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'customer',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    location: { city: 'Boston', state: 'MA' },
    phone: '(234) 567-8901',
    createdAt: new Date('2023-01-05'),
    requestsCreated: 5,
  },
  {
    id: 'c2',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'customer',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    location: { city: 'Seattle', state: 'WA' },
    phone: '(567) 890-1234',
    createdAt: new Date('2023-02-10'),
    requestsCreated: 3,
  },
];

// Mock Service Requests
export const serviceRequests: ServiceRequest[] = [
  {
    id: 'r1',
    customerId: 'c1',
    title: 'Leaking Kitchen Sink',
    description: 'My kitchen sink has been leaking for a few days and needs to be fixed.',
    category: 'Home Repair',
    subcategory: 'Plumbing',
    location: { city: 'Boston', state: 'MA' },
    status: 'open',
    budget: 150,
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-08-01'),
    quotes: [],
  },
  {
    id: 'r2',
    customerId: 'c2',
    title: 'Home Network Setup',
    description: 'Need help setting up a mesh network in my new home.',
    category: 'Technology',
    subcategory: 'Network Setup',
    location: { city: 'Seattle', state: 'WA' },
    status: 'in_progress',
    budget: 200,
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date('2023-07-27'),
    quotes: [],
  },
];

// Mock Reviews
export const reviews: Review[] = [
  {
    id: 'rev1',
    requestId: 'r1',
    customerId: 'c1',
    providerId: 'p1',
    rating: 5,
    comment: 'John did an excellent job fixing our sink. Very professional and timely.',
    createdAt: new Date('2023-08-10'),
  },
  {
    id: 'rev2',
    requestId: 'r2',
    customerId: 'c2',
    providerId: 'p2',
    rating: 4,
    comment: 'Maria set up our network efficiently. Good communication throughout the process.',
    createdAt: new Date('2023-08-05'),
  },
];