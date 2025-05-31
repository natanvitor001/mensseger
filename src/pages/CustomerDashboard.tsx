import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar, Clock, MapPin, AlertCircle, Home, FileText, MessageSquare, PenTool as Tool, User } from 'lucide-react';
import { serviceCategories } from '../data/categories';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/auth';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect if not logged in as customer
  if (!currentUser || currentUser.role !== 'customer') {
    navigate('/login');
    return null;
  }

  const selectedCategoryData = serviceCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar 
                  src={currentUser.profileImage} 
                  alt={currentUser.name} 
                  size="lg"
                />
                <div>
                  <h1 className="text-2xl font-bold">Olá, {currentUser.name}</h1>
                  <p className="text-teal-200">
                    <MapPin className="w-4 h-4 inline-block mr-1" />
                    {currentUser.location?.city}, {currentUser.location?.state}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-6 pt-4 border-t border-teal-800">
              <Link 
                to="/customer/dashboard" 
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Início / Dashboard</span>
              </Link>
              
              <Link 
                to="/customer/requests" 
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Meus Pedidos</span>
              </Link>
              
              <Link 
                to="/customer/messages" 
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Mensagens</span>
              </Link>
              
              <Link 
                to="/request-service" 
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors"
              >
                <Tool className="w-5 h-5" />
                <span>Solicitar Serviço</span>
              </Link>
              
              <Link 
                to="/customer/profile" 
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Minha Conta</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Categorias de Serviço</h2>
              <div className="space-y-2">
                {serviceCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory('');
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-teal-100 text-teal-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pesquisar serviços..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Selected Category Details */}
            {selectedCategoryData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">{selectedCategoryData.name}</h2>
                
                {/* Subcategories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Selecione o tipo de serviço:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedCategoryData.subcategories.map(subcategory => (
                      <button
                        key={subcategory}
                        onClick={() => setSelectedSubcategory(subcategory)}
                        className={`p-3 rounded-lg border text-sm transition-colors ${
                          selectedSubcategory === subcategory
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-teal-200 hover:bg-teal-50'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                {selectedSubcategory && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Solicitar {selectedSubcategory}</h3>
                      <Button
                        onClick={() => navigate('/request-service')}
                        size="sm"
                      >
                        Fazer Solicitação
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-6 h-6 text-teal-600 mb-2" />
                        <h4 className="font-medium">Agendar Serviço</h4>
                        <p className="text-sm text-gray-600">Escolha a melhor data</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-6 h-6 text-teal-600 mb-2" />
                        <h4 className="font-medium">Urgência</h4>
                        <p className="text-sm text-gray-600">Serviço para hoje</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-teal-600 mb-2" />
                        <h4 className="font-medium">Orçamento</h4>
                        <p className="text-sm text-gray-600">Compare preços</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Requests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Suas Últimas Solicitações</h2>
              <div className="space-y-4">
                {/* Example request - Replace with actual data */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Pintura de Sala</h3>
                      <p className="text-sm text-gray-600">Categoria: Construção e Reformas</p>
                    </div>
                    <Badge variant="primary">Em Andamento</Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Solicitado há 2 dias
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}