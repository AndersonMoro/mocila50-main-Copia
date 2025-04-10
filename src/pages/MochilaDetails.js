import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import { FaUtensils, FaTools, FaSoap, FaFileAlt, FaEllipsisH, FaArrowLeft, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { capitalizeFirstLetter } from '../utils/stringUtils';
import Button from '../components/common/Button';

function MochilaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mochila, setMochila] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchMochilaDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('mochilas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setMochila(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da mochila:', error.message);
      setError('Não foi possível carregar os detalhes da mochila');
    }
  }, [id]);

  const fetchItens = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .eq('mochila_id', id)
        .order('nome');
      
      if (error) throw error;
      
      setItens(data || []);
      console.log("Itens carregados:", data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error.message);
      setError('Não foi possível carregar os itens da mochila');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const categorias = [
    { id: 'alimentos', nome: 'Alimentos', icon: <FaUtensils className="h-5 w-5" /> },
    { id: 'ferramentas', nome: 'Ferramentas', icon: <FaTools className="h-5 w-5" /> },
    { id: 'higiene', nome: 'Higiene e Limpeza', icon: <FaSoap className="h-5 w-5" /> },
    { id: 'documentos', nome: 'Documentos', icon: <FaFileAlt className="h-5 w-5" /> },
    { id: 'outros', nome: 'Outros', icon: <FaEllipsisH className="h-5 w-5" /> }
  ];

  useEffect(() => {
    fetchMochilaDetails();
    fetchItens();
  }, [fetchMochilaDetails, fetchItens]); // Adicionar as funções como dependências

  function getItemStatus(item) {
    if (!item.validade) return 'normal';
    
    const hoje = new Date();
    const dataValidade = new Date(item.validade);
    const diffDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
    
    if (diffDias < 0) return 'vencido';
    if (diffDias <= 7) return 'proximo';
    return 'normal';
  }

  function getStatusClass(status) {
    switch (status) {
      case 'vencido': return 'bg-red-100 border-red-500 text-red-800';
      case 'proximo': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-white border-gray-200';
    }
  }

  function getStatusText(status, validade) {
    if (!validade) return '';
    
    switch (status) {
      case 'vencido': return 'Vencido';
      case 'proximo': {
        const hoje = new Date();
        const dataValidade = new Date(validade);
        const diffDias = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
        return `Vence em ${diffDias} dias`;
      }
      default: return '';
    }
  }

  async function handleDeleteItem() {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('itens')
        .delete()
        .eq('id', itemToDelete.id);
      
      if (error) throw error;
      
      setItens(itens.filter(item => item.id !== itemToDelete.id));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir item:', error.message);
      setError('Não foi possível excluir o item');
    }
  }

  // Modificar a lógica de filtragem para filtrar por categoria selecionada
  const filteredItens = activeTab === 'todas' 
    ? itens 
    : itens.filter(item => item.categoria === activeTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title={mochila ? mochila.nome : 'Carregando...'} 
        showBackButton={true} 
        backPath="/"
        mochilaId={id}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          {/* Navegação por categorias apenas na versão desktop */}
          <div className="hidden sm:block border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('todas')}
                className={`px-3 py-4 text-sm font-medium ${
                  activeTab === 'todas'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Todas
              </button>
              
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setActiveTab(categoria.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium ${
                    activeTab === categoria.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{categoria.icon}</span>
                    {categoria.nome}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              {loading ? (
                <div className="text-center py-10">
                  <div className="spinner"></div>
                  <p className="mt-2 text-gray-600">Carregando itens...</p>
                </div>
              ) : filteredItens.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Nenhum item encontrado nesta categoria.</p>
                  <button
                    onClick={() => navigate(`/mochila/${id}/add-item/${activeTab === 'todas' ? 'alimentos' : activeTab}`)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <FaPlus className="mr-2" />
                    Adicionar Item
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => navigate(`/mochila/${id}/add-item/${activeTab === 'todas' ? 'alimentos' : activeTab}`)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <FaPlus className="mr-2" />
                      Adicionar Item
                    </button>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {filteredItens.map((item) => {
                      const status = getItemStatus(item);
                      const statusClass = getStatusClass(status);
                      const statusText = getStatusText(status, item.validade);
                      
                      return (
                        <li key={item.id} className={`py-4 px-2 rounded-md border ${statusClass}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {capitalizeFirstLetter(item.nome)} 
                                <span className="ml-2 text-sm font-medium text-gray-600">
                                  (Qtd: {item.quantidade})
                                </span>
                              </h3>
                              
                              {/* Remover a linha abaixo que exibe o nome da mochila novamente */}
                              {/* <h1 className="text-2xl font-bold text-gray-900">
                                {mochila ? capitalizeFirstLetter(mochila.nome) : 'Carregando...'}
                              </h1> */}
                              
                              {item.validade && (
                                <span className="text-sm text-gray-500">
                                  Validade: {new Date(item.validade).toLocaleDateString()}
                                </span>
                              )}
                              {statusText && (
                                <span className={`text-sm font-medium ${status === 'vencido' ? 'text-red-800' : 'text-yellow-800'}`}>
                                  {statusText}
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  navigate(`/mochila/${id}/edit-item/${item.id}`);
                                }}
                                className="p-2 text-gray-500 hover:text-blue-600"
                              >
                                <FaEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setItemToDelete(item);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-gray-500 hover:text-red-600"
                              >
                                <FaTrash className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
      </main>

      {/* Modal de confirmação para excluir item */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Excluir Item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir o item "{itemToDelete?.nome}"? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteItem}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MochilaDetails;