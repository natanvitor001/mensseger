import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, MapPin, Phone, Briefcase } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { serviceCategories } from '../data/categories';

export function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'provider'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    state: '',
    bio: '',
    categories: [] as string[],
    subcategories: [] as string[]
  });

  const { registerCustomer, registerProvider } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      location: {
        city: formData.city,
        state: formData.state,
      },
    };

    if (userType === 'customer') {
      registerCustomer(baseData);
    } else {
      registerProvider({
        ...baseData,
        bio: formData.bio,
        skills: formData.subcategories,
        categories: formData.categories,
        availability: true,
      });
    }

    navigate('/login');
  };

  const handleCategoryChange = (categoryName: string) => {
    setFormData(prev => {
      const categories = prev.categories.includes(categoryName)
        ? prev.categories.filter(c => c !== categoryName)
        : [...prev.categories, categoryName];

      // Atualizar subcategorias
      const selectedCategories = serviceCategories.filter(c => categories.includes(c.name));
      const availableSubcategories = selectedCategories.flatMap(c => c.subcategories);
      const subcategories = prev.subcategories.filter(s => availableSubcategories.includes(s));

      return {
        ...prev,
        categories,
        subcategories
      };
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
      <Link 
        to="/" 
        className="p-4 text-teal-600 hover:text-teal-700 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Home
      </Link>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Criar uma Conta</h2>
            <p className="text-gray-600">Junte-se à nossa comunidade</p>
          </div>

          <div className="flex rounded-lg overflow-hidden mb-6">
            <button
              type="button"
              className={`flex-1 py-3 ${
                userType === 'customer'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setUserType('customer')}
            >
              Cliente
            </button>
            <button
              type="button"
              className={`flex-1 py-3 ${
                userType === 'provider'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setUserType('provider')}
            >
              Prestador
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Crie uma senha"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Digite seu telefone"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Cidade"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Estado"
                  required
                />
              </div>
            </div>

            {userType === 'provider' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografia Profissional
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Conte sobre sua experiência profissional"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorias de Serviço
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceCategories.map(category => (
                      <div key={category.id} className="flex items-start">
                        <input
                          type="checkbox"
                          id={category.id}
                          checked={formData.categories.includes(category.name)}
                          onChange={() => handleCategoryChange(category.name)}
                          className="mt-1"
                        />
                        <label htmlFor={category.id} className="ml-2 text-sm text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidades
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceCategories
                        .filter(category => formData.categories.includes(category.name))
                        .flatMap(category => category.subcategories)
                        .map(subcategory => (
                          <div key={subcategory} className="flex items-start">
                            <input
                              type="checkbox"
                              id={subcategory}
                              checked={formData.subcategories.includes(subcategory)}
                              onChange={() => handleSubcategoryChange(subcategory)}
                              className="mt-1"
                            />
                            <label htmlFor={subcategory} className="ml-2 text-sm text-gray-700">
                              {subcategory}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Criar Conta
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-500 font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}