import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Package, Phone, Mail, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { ServiceRequest, CreditPackage, Provider } from '../types';

const creditPackages: CreditPackage[] = [
  {
    id: 'basic',
    name: 'Pacote Básico',
    credits: 10,
    price: 49.90,
    description: 'Ideal para começar'
  },
  {
    id: 'pro',
    name: 'Pacote Profissional',
    credits: 25,
    price: 99.90,
    description: 'Melhor custo-benefício'
  },
  {
    id: 'premium',
    name: 'Pacote Premium',
    credits: 60,
    price: 199.90,
    description: 'Para profissionais ativos'
  }
];

export function ProviderDashboard() {
  const navigate = useNavigate();
  const { currentUser, serviceRequests, purchaseCredits, unlockCustomerContact } = useAuthStore();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
  const provider = currentUser as Provider;
  
  if (!provider || provider.role !== 'provider') {
    navigate('/login');
    return null;
  }

  const relevantRequests = serviceRequests.filter(request => 
    provider.categories.includes(request.category) && request.status === 'open'
  );

  const handlePurchaseCredits = (packageId: string) => {
    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      purchaseCredits(provider.id, selectedPackage.credits);
    }
  };

  const handleUnlockContact = (request: ServiceRequest) => {
    if (provider.credits >= 1) {
      unlockCustomerContact(request.id, provider.id);
      setSelectedRequest(request);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar src={provider.profileImage} alt={provider.name} size="lg" />
              <div>
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <p className="text-teal-200">{provider.categories.join(', ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{provider.credits} créditos</p>
              <p className="text-teal-200">Disponíveis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pedidos Disponíveis */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Pedidos Disponíveis</h2>
            <div className="space-y-4">
              {relevantRequests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{request.title}</h3>
                      <p className="text-gray-600">{request.description}</p>
                    </div>
                    <Badge variant="primary">
                      R$ {request.budget?.toFixed(2)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">
                        {request.category}
                      </Badge>
                      <span className="text-gray-500">
                        {request.location.city}, {request.location.state}
                      </span>
                    </div>
                    
                    {request.customerContact ? (
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-700">
                          <Mail className="w-4 h-4 mr-2" />
                          {request.customerContact.email}
                        </p>
                        <p className="flex items-center text-gray-700">
                          <Phone className="w-4 h-4 mr-2" />
                          {request.customerContact.phone}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlockContact(request)}
                        className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        disabled={provider.credits < 1}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Desbloquear Contato (1 crédito)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pacotes de Créditos */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Comprar Créditos</h2>
            <div className="space-y-4">
              {creditPackages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{pkg.name}</h3>
                      <p className="text-gray-600">{pkg.description}</p>
                    </div>
                    <Package className="w-6 h-6 text-teal-600" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-2xl font-bold">R$ {pkg.price.toFixed(2)}</p>
                      <p className="text-gray-600">{pkg.credits} créditos</p>
                    </div>
                    <button
                      onClick={() => handlePurchaseCredits(pkg.id)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}