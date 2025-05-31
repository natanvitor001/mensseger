import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle2, Mail, Lock, ArrowLeft, Settings } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'customer' | 'provider' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password, userType);
    if (success) {
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'customer') {
        navigate('/customer/dashboard');
      } else {
        navigate('/provider/dashboard');
      }
    } else {
      setError('Email ou senha inválidos');
    }
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

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <UserCircle2 className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex rounded-lg overflow-hidden mb-6">
            <button
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
              className={`flex-1 py-3 ${
                userType === 'provider'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setUserType('provider')}
            >
              Prestador
            </button>
            <button
              className={`flex-1 py-3 ${
                userType === 'admin'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setUserType('admin')}
            >
              <Settings className="w-4 h-4 inline-block mr-1" />
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Digite seu email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-teal-600 hover:text-teal-500">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-teal-600 hover:text-teal-500 font-medium">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}