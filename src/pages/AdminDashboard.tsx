import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Settings,
  Palette,
  Grid,
  UserX,
  UserCheck,
  PlusCircle,
  MinusCircle,
  Save,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button'; // Using the existing Button component

export function AdminDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    customers,
    providers,
    removeUser,
    approveUser,
    updateSystemSettings,
    systemSettings,
    serviceCategories, 
    addCategory, 
    removeCategory, 
    addSubcategory, 
    removeSubcategory 
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState('categories'); // Default to categories for testing
  
  // State for Appearance Tab (Local)
  const [themeColors, setThemeColors] = useState({
    primary: '#0D9488',
    secondary: '#4F46E5',
    accent: '#EC4899'
  });

  // State for Settings Tab
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // State for Categories Tab - Add Form Management
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null); // Holds category ID
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Load initial settings from store
  useEffect(() => {
    if (systemSettings) {
      setSiteName(systemSettings.siteName || 'SkillMatch');
      setSiteDescription(systemSettings.siteDescription || 'Conectando profissionais qualificados a clientes');
      setAllowRegistrations(systemSettings.allowRegistrations !== undefined ? systemSettings.allowRegistrations : true);
      setMaintenanceMode(systemSettings.maintenanceMode !== undefined ? systemSettings.maintenanceMode : false);
    }
  }, [systemSettings]);

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') {
    return null; 
  }

  // --- User Management Handlers ---
  const handleRemoveUser = (userId: string, userType: 'customer' | 'provider') => {
    if (window.confirm(`Tem certeza que deseja remover este ${userType}?`)) {
      removeUser(userId, userType);
    }
  };

  const handleApproveUser = (userId: string, userType: 'customer' | 'provider') => {
    approveUser(userId, userType);
    alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} aprovado(a)!`);
  };

  // --- Settings Handlers ---
  const handleSaveSettings = () => {
    const newSettings = {
      siteName,
      siteDescription,
      allowRegistrations,
      maintenanceMode
    };
    updateSystemSettings(newSettings);
    alert('Configurações salvas com sucesso!');
  };

  const handleRestoreSettings = () => {
    const defaultSettings = { siteName: 'SkillMatch', siteDescription: 'Conectando profissionais qualificados a clientes', allowRegistrations: true, maintenanceMode: false };
    setSiteName(defaultSettings.siteName);
    setSiteDescription(defaultSettings.siteDescription);
    setAllowRegistrations(defaultSettings.allowRegistrations);
    setMaintenanceMode(defaultSettings.maintenanceMode);
    updateSystemSettings(defaultSettings); 
    alert('Configurações restauradas para o padrão!');
  };

  // --- Category Management Handlers ---
  const handleShowAddCategoryForm = () => {
    setIsAddingCategory(true);
    setNewCategoryName('');
  };

  const handleConfirmAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setIsAddingCategory(false);
      setNewCategoryName('');
    } else {
      alert('Por favor, insira um nome para a categoria.');
    }
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta categoria e todas as suas subcategorias?')) {
      removeCategory(categoryId);
    }
  };

  const handleShowAddSubcategoryForm = (categoryId: string) => {
    setAddingSubcategoryTo(categoryId);
    setNewSubcategoryName('');
  };

  const handleConfirmAddSubcategory = () => {
    if (newSubcategoryName.trim() && addingSubcategoryTo) {
      addSubcategory(addingSubcategoryTo, newSubcategoryName.trim());
      setAddingSubcategoryTo(null);
      setNewSubcategoryName('');
    } else {
      alert('Por favor, insira um nome para a subcategoria.');
    }
  };

  const handleCancelAddSubcategory = () => {
    setAddingSubcategoryTo(null);
    setNewSubcategoryName('');
  };

  const handleRemoveSubcategory = (categoryId: string, subcategoryId: string) => {
     if (window.confirm(`Tem certeza que deseja remover a subcategoria?`)) { // Simplified message
       removeSubcategory(categoryId, subcategoryId);
     }
  };

  // --- Appearance Handlers (Local Only) ---
  const handleSaveAppearance = () => alert('Funcionalidade (Salvar Aparência) não implementada no store.');
  const handleRestoreAppearance = () => {
     setThemeColors({ primary: '#0D9488', secondary: '#4F46E5', accent: '#EC4899' });
     alert('Cores restauradas para o padrão (localmente).');
  }

  const tabs = [
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'categories', name: 'Categorias', icon: Grid },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-teal-900 text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <Button onClick={() => navigate('/')} variant="secondary" size="sm">
             Voltar para Home
           </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="flex space-x-4 mb-8 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-teal-700 border-b-2 border-teal-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* --- Users Tab --- */}  
          {activeTab === 'users' && (
            // ... (User management content - unchanged) ...
            <div>
              <h2 className="text-xl font-bold mb-6">Gerenciar Usuários</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clientes */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Clientes ({customers.length})</h3>
                    {customers.length === 0 ? <p className='text-gray-500 italic'>Nenhum cliente cadastrado.</p> : customers.map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{customer.name} {customer.status === 'pending' && <Badge variant="warning" className='ml-2 text-xs'>Pendente</Badge>}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveUser(customer.id, 'customer')}
                            className="text-red-500 hover:bg-red-100 tooltip"
                            data-tooltip="Remover Cliente"
                          >
                            <UserX className="w-5 h-5" />
                          </Button>
                          {customer.status === 'pending' && (
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               onClick={() => handleApproveUser(customer.id, 'customer')}
                               className="text-green-500 hover:bg-green-100 tooltip"
                               data-tooltip="Aprovar Cliente"
                             >
                               <UserCheck className="w-5 h-5" />
                             </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Prestadores */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Prestadores ({providers.length})</h3>
                     {providers.length === 0 ? <p className='text-gray-500 italic'>Nenhum prestador cadastrado.</p> : providers.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{provider.name} {provider.status === 'pending' && <Badge variant="warning" className='ml-2 text-xs'>Pendente</Badge>}</p>
                          <p className="text-sm text-gray-500">{provider.email}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(provider.categories || []).map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveUser(provider.id, 'provider')}
                            className="text-red-500 hover:bg-red-100 tooltip"
                            data-tooltip="Remover Prestador"
                          >
                            <UserX className="w-5 h-5" />
                          </Button>
                           {provider.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleApproveUser(provider.id, 'provider')}
                                className="text-green-500 hover:bg-green-100 tooltip"
                                data-tooltip="Aprovar Prestador"
                              >
                                <UserCheck className="w-5 h-5" />
                              </Button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Categories Tab --- */}  
          {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Gerenciar Categorias</h2>
              
              {/* Add New Category Form */} 
              {!isAddingCategory ? (
                <Button 
                  onClick={handleShowAddCategoryForm}
                  size="sm"
                  className="mb-6"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Adicionar Nova Categoria
                </Button>
              ) : (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
                  <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700 mb-2">Nome da Nova Categoria</label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="newCategoryName"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ex: Jardinagem"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-sm"
                      autoFocus
                    />
                    {/* Updated Buttons */}
                    <Button onClick={handleConfirmAddCategory} size="sm" variant="default">
                      <Check className="w-4 h-4 mr-1" /> Adicionar
                    </Button>
                    <Button onClick={handleCancelAddCategory} size="sm" variant="outline">
                      <X className="w-4 h-4 mr-1" /> Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* List of Categories */} 
              <div className="space-y-6">
                {(serviceCategories || []).map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 shadow-sm">
                    {/* Category Header */} 
                    <div className="flex items-center justify-between mb-4 pb-2 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleShowAddSubcategoryForm(category.id)}
                          className="text-teal-600 hover:bg-teal-50 tooltip"
                          data-tooltip="Adicionar Subcategoria"
                          disabled={addingSubcategoryTo !== null || isAddingCategory} // Disable if any add form is open
                        >
                          <PlusCircle className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveCategory(category.id)}
                          className="text-red-500 hover:bg-red-50 tooltip"
                          data-tooltip="Remover Categoria"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Add New Subcategory Form (conditional) */} 
                    {addingSubcategoryTo === category.id && (
                      <div className="my-4 p-3 border rounded-md bg-gray-50 shadow-inner">
                        <label htmlFor={`newSubcategoryName-${category.id}`} className="block text-xs font-medium text-gray-600 mb-1">Nova Subcategoria para "{category.name}"</label>
                        <div className="flex items-center space-x-2">
                          <input
                            id={`newSubcategoryName-${category.id}`}
                            type="text"
                            value={newSubcategoryName}
                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                            placeholder="Ex: Corte de Grama"
                            className="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm shadow-sm"
                            autoFocus
                          />
                           {/* Updated Buttons */}
                          <Button onClick={handleConfirmAddSubcategory} size="xs" variant="default">
                            <Check className="w-3 h-3 mr-1" /> Adicionar
                          </Button>
                          <Button onClick={handleCancelAddSubcategory} size="xs" variant="outline">
                            <X className="w-3 h-3 mr-1" /> Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* List of Subcategories */} 
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {(category.subcategories || []).map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm transition-colors">
                          <span className="text-gray-700">{subcategory.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            onClick={() => handleRemoveSubcategory(category.id, subcategory.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 tooltip"
                            data-tooltip="Remover Subcategoria"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                       {(category.subcategories || []).length === 0 && addingSubcategoryTo !== category.id && 
                         <p className='text-gray-500 italic text-sm col-span-full mt-2'>Nenhuma subcategoria.</p>}
                    </div>
                  </div>
                ))}
                 {(serviceCategories || []).length === 0 && !isAddingCategory && 
                   <p className='text-gray-500 italic'>Nenhuma categoria definida.</p>}
              </div>
            </div>
          )}

          {/* --- Appearance Tab --- */}  
          {activeTab === 'appearance' && (
             // ... (Appearance content - unchanged) ...
            <div>
              <h2 className="text-xl font-bold mb-6">Personalizar Aparência (Local)</h2>
               <p className="text-sm text-orange-600 mb-4">Atenção: As alterações de aparência não são salvas permanentemente ainda.</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cores do Tema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Cor Primária
                      </label>
                      <input
                        id="primaryColor"
                        type="color"
                        value={themeColors.primary}
                        onChange={(e) => setThemeColors({...themeColors, primary: e.target.value})}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Cor Secundária
                      </label>
                      <input
                        id="secondaryColor"
                        type="color"
                        value={themeColors.secondary}
                        onChange={(e) => setThemeColors({...themeColors, secondary: e.target.value})}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Cor de Destaque
                      </label>
                      <input
                        id="accentColor"
                        type="color"
                        value={themeColors.accent}
                        onChange={(e) => setThemeColors({...themeColors, accent: e.target.value})}
                        className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 border-t pt-4">
                  <Button 
                    onClick={handleRestoreAppearance}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restaurar Padrão
                  </Button>
                  <Button 
                    onClick={handleSaveAppearance}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* --- Settings Tab --- */}  
          {activeTab === 'settings' && (
            // ... (Settings content - unchanged) ...
            <div>
              <h2 className="text-xl font-bold mb-6">Configurações do Sistema</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Site
                      </label>
                      <input
                        id="siteName"
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        id="siteDescription"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input 
                        id="allowRegistrations"
                        type="checkbox" 
                        checked={allowRegistrations}
                        onChange={(e) => setAllowRegistrations(e.target.checked)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                       />
                      <label htmlFor="allowRegistrations" className="text-sm text-gray-700">Permitir novos cadastros</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input 
                        id="maintenanceMode"
                        type="checkbox" 
                        checked={maintenanceMode}
                        onChange={(e) => setMaintenanceMode(e.target.checked)}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" 
                      />
                      <label htmlFor="maintenanceMode" className="text-sm text-gray-700">Modo de manutenção</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 border-t pt-4">
                  <Button 
                    onClick={handleRestoreSettings}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restaurar Padrão
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add Button size 'xs' and 'icon-sm' variants to your Button component if they don't exist
// Example CSS for Tooltips (add to index.css or similar)
/*
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-5px);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
}

.tooltip:hover::after {
  opacity: 1;
  visibility: visible;
}
*/

