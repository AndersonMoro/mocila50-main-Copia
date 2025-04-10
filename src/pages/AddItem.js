import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

function AddItem() {
  const { id: mochilaId, categoria } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: 1,
    categoria: categoria || 'alimentos',
    validade: '',
    observacoes: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log("Tentando adicionar item:", formData, "para mochila:", mochilaId);
      
      // Verificar se o item já existe
      const { data: existingItems, error: queryError } = await supabase
        .from('itens')
        .select('*')
        .eq('mochila_id', mochilaId)
        .ilike('nome', formData.nome);
        
      if (queryError) throw queryError;
      
      console.log("Itens existentes:", existingItems);
      
      let result;
      
      if (existingItems && existingItems.length > 0) {
        // Atualizar item existente
        const existingItem = existingItems[0];
        const newQuantidade = parseInt(existingItem.quantidade) + parseInt(formData.quantidade);
        
        const updateData = {
          quantidade: newQuantidade
        };
        
        // Adiciona campos opcionais apenas para alimentos
        if (formData.categoria === 'alimentos') {
          if (formData.validade) updateData.validade = formData.validade;
        }
        
        console.log("Atualizando item existente:", existingItem.id, "com:", updateData);
        
        const { data, error: updateError } = await supabase
          .from('itens')
          .update(updateData)
          .eq('id', existingItem.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        
        result = data;
      } else {
        // Inserir novo item
        const newItem = {
          nome: formData.nome,
          quantidade: parseInt(formData.quantidade),
          categoria: formData.categoria,
          mochila_id: mochilaId
        };
        
        // Adiciona campos opcionais apenas para alimentos
        if (formData.categoria === 'alimentos') {
          if (formData.validade) newItem.validade = formData.validade;
          if (formData.observacoes) newItem.observacoes = formData.observacoes;
        }
        
        console.log("Inserindo novo item:", newItem);
        
        const { data, error: insertError } = await supabase
          .from('itens')
          .insert([newItem])
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        result = data;
      }
      
      console.log("Item adicionado com sucesso:", result);
      console.log("Redirecionando para:", `/mochila/${mochilaId}`);
      
      // Redirecionar para a página de detalhes da mochila
      navigate(`/mochila/${mochilaId}`);
    } catch (error) {
      console.error("Erro ao adicionar item:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="Adicionar Item" 
        showBackButton={true} 
        backPath={`/mochila/${mochilaId}`}
        mochilaId={mochilaId}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4 sm:p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Item
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="alimentos">Alimentos</option>
                  <option value="agua">Água</option>
                  <option value="medicamentos">Medicamentos</option>
                  <option value="higiene">Higiene</option>
                  <option value="documentos">Documentos</option>
                  <option value="ferramentas">Ferramentas</option>
                  <option value="roupas">Roupas</option>
                  <option value="geral">Geral</option>
                </select>
              </div>
            </div>
            
            {/* Only show validade field for food items */}
            {formData.categoria === 'alimentos' && (
              <div>
                <label htmlFor="validade" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade (opcional)
                </label>
                <input
                  type="date"
                  id="validade"
                  name="validade"
                  value={formData.validade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {/* Only show observacoes field for food items */}
            {formData.categoria === 'alimentos' && (
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/mochila/${mochilaId}`)}
                className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddItem;