import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Provider, ServiceRequest, Admin, ServiceCategory, Subcategory } from '../types';
import { Home } from 'lucide-react';

interface SystemSettings {
  siteName?: string;
  siteDescription?: string;
  allowRegistrations?: boolean;
  maintenanceMode?: boolean;
}

interface AuthState {
  customers: Customer[];
  providers: Provider[];
  admins: Admin[];
  currentUser: (Customer | Provider | Admin) | null;
  serviceRequests: ServiceRequest[];
  systemSettings: SystemSettings;
  serviceCategories: ServiceCategory[];

  // User management
  registerCustomer: (customer: Omit<Customer, 'id' | 'role' | 'createdAt' | 'requestsCreated' | 'status'>) => void;
  registerProvider: (provider: Omit<Provider, 'id' | 'role' | 'createdAt' | 'averageRating' | 'reviewCount' | 'completedJobs' | 'portfolio' | 'credits' | 'status'>) => void;
  updateCustomer: (customer: Customer) => void;
  login: (email: string, password: string, userType: 'customer' | 'provider' | 'admin') => boolean;
  logout: () => void;
  removeUser: (userId: string, userType: 'customer' | 'provider') => void;
  approveUser: (userId: string, userType: 'customer' | 'provider') => void;

  // Provider specific
  purchaseCredits: (providerId: string, amount: number) => void;
  unlockCustomerContact: (requestId: string, providerId: string) => void;

  // Admin specific
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  addCategory: (name: string) => void;
  removeCategory: (categoryId: string) => void;
  addSubcategory: (categoryId: string, subcategoryName: string) => void;
  removeSubcategory: (categoryId: string, subcategoryId: string) => void;
}

const initialCategories: ServiceCategory[] = [
  {
    id: 'cat1',
    name: 'Reparos Domésticos',
    icon: Home,
    description: 'Consertos e instalações em casa.',
    subcategories: [
      { id: 'sub1', name: 'Encanamento' },
      { id: 'sub2', name: 'Elétrica' },
      { id: 'sub3', name: 'Pintura' },
    ]
  },
  // ... other categories
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      customers: [],
      providers: [],
      admins: [
        {
          id: 'admin1',
          name: 'Administrador Principal',
          email: 'admin@admin.com',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date(),
          level: 'super',
          permissions: ['all']
        }
      ],
      currentUser: null,
      serviceRequests: [],
      systemSettings: {
        siteName: 'SkillMatch',
        siteDescription: 'Conectando profissionais qualificados a clientes',
        allowRegistrations: true,
        maintenanceMode: false,
      },
      serviceCategories: initialCategories,

      // Actions
      registerCustomer: (customerData) => {
        const newCustomer: Customer = {
          id: `c${Date.now()}`,
          role: 'customer',
          createdAt: new Date(),
          requestsCreated: 0,
          status: 'pending',
          ...customerData,
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
      },

      registerProvider: (providerData) => {
        const newProvider: Provider = {
          id: `p${Date.now()}`,
          role: 'provider',
          createdAt: new Date(),
          averageRating: 0,
          reviewCount: 0,
          completedJobs: 0,
          portfolio: [],
          credits: 0,
          status: 'pending',
          categories: [],
          ...providerData,
        };
        set((state) => ({ providers: [...state.providers, newProvider] }));
      },

      updateCustomer: (updatedCustomer) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          ),
          currentUser: state.currentUser?.id === updatedCustomer.id ? updatedCustomer : state.currentUser
        }));
      },

      login: (email, password, userType) => {
        const state = get();
        let user: Customer | Provider | Admin | null | undefined = null;

        switch (userType) {
          case 'customer':
            user = state.customers.find(c => c.email === email);
            break;
          case 'provider':
            user = state.providers.find(p => p.email === email);
            break;
          case 'admin':
            user = state.admins.find(a => a.email === email && a.password === password);
            break;
        }

        if (user) {
          set({ currentUser: user });
          return true;
        }
        set({ currentUser: null });
        return false;
      },

      logout: () => {
        set({ currentUser: null });
      },

      removeUser: (userId, userType) => {
        set((state) => ({
          customers: userType === 'customer'
            ? state.customers.filter(c => c.id !== userId)
            : state.customers,
          providers: userType === 'provider'
            ? state.providers.filter(p => p.id !== userId)
            : state.providers
        }));
      },

      approveUser: (userId, userType) => {
        set((state) => ({
          customers: userType === 'customer'
            ? state.customers.map(c => c.id === userId ? { ...c, status: 'approved' } : c)
            : state.customers,
          providers: userType === 'provider'
            ? state.providers.map(p => p.id === userId ? { ...p, status: 'approved' } : p)
            : state.providers
        }));
      },

      purchaseCredits: (providerId, amount) => {
        set((state) => ({
          providers: state.providers.map(provider =>
            provider.id === providerId
              ? { ...provider, credits: (provider.credits || 0) + amount }
              : provider
          ),
          currentUser: state.currentUser?.id === providerId && state.currentUser.role === 'provider'
            ? { ...state.currentUser, credits: ((state.currentUser as Provider).credits || 0) + amount }
            : state.currentUser
        }));
      },

      unlockCustomerContact: (requestId, providerId) => {
        const state = get();
        const provider = state.providers.find(p => p.id === providerId);
        const cost = 1;

        if (!provider || (provider.credits || 0) < cost) {
          console.error('Créditos insuficientes ou provedor não encontrado.');
          return;
        }

        set((state) => {
          const updatedProviders = state.providers.map(p =>
            p.id === providerId
              ? { ...p, credits: (p.credits || 0) - cost }
              : p
          );

          const updatedRequests = state.serviceRequests.map(request => {
            if (request.id === requestId) {
              const customer = state.customers.find(c => c.id === request.customerId);
              return {
                ...request,
                customerContact: {
                  email: customer?.email || 'N/A',
                  phone: customer?.phone || 'N/A'
                }
              };
            }
            return request;
          });

          const updatedCurrentUser = state.currentUser?.id === providerId && state.currentUser.role === 'provider'
            ? { ...state.currentUser, credits: ((state.currentUser as Provider).credits || 0) - cost }
            : state.currentUser;

          return {
            providers: updatedProviders,
            serviceRequests: updatedRequests,
            currentUser: updatedCurrentUser
          };
        });
      },

      updateSystemSettings: (settings) => {
        set((state) => ({
          systemSettings: {
            ...state.systemSettings,
            ...settings
          }
        }));
      },

      addCategory: (name) => {
        const newCategory: ServiceCategory = {
          id: `cat${Date.now()}`,
          name: name,
          subcategories: [],
        };
        set((state) => ({
          serviceCategories: [...state.serviceCategories, newCategory]
        }));
      },

      removeCategory: (categoryId) => {
        set((state) => ({
          serviceCategories: state.serviceCategories.filter(cat => cat.id !== categoryId)
        }));
      },

      addSubcategory: (categoryId, subcategoryName) => {
        const newSubcategory: Subcategory = {
          id: `sub${Date.now()}`,
          name: subcategoryName,
        };
        set((state) => ({
          serviceCategories: state.serviceCategories.map(cat =>
            cat.id === categoryId
              ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
              : cat
          )
        }));
      },

      removeSubcategory: (categoryId, subcategoryId) => {
        set((state) => ({
          serviceCategories: state.serviceCategories.map(cat =>
            cat.id === categoryId
              ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId) }
              : cat
          )
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);