import React from 'react';
import { Search, Briefcase, Star, Shield, Settings } from 'lucide-react';
import { categories } from '../data/mockData';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Navigation */}
      <nav className="bg-teal-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SkillMatch</h1>
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/dashboard" 
              className="bg-teal-800 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
            <Link 
              to="/login" 
              className="bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-teal-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Encontre Profissionais Especializados para Qualquer Tarefa</h1>
            <p className="text-xl mb-8">Conecte-se com prestadores de serviço verificados na sua região</p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Qual serviço você precisa?"
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Serviços Profissionais</h3>
              <p className="text-gray-600">Acesse milhares de profissionais verificados prontos para ajudar</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualidade Garantida</h3>
              <p className="text-gray-600">Todos os profissionais são avaliados e revisados pela nossa comunidade</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plataforma Segura</h3>
              <p className="text-gray-600">Pagamentos seguros e satisfação garantida</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Categorias Populares</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    {/* @ts-ignore */}
                    {React.createElement(category.icon, {
                      className: "w-6 h-6 text-teal-600"
                    })}
                  </div>
                  <h3 className="text-lg font-semibold ml-3">{category.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{category.description}</p>
                <div className="mt-4">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.id}
                      className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600 mr-2 mb-2"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}