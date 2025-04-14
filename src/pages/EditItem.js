import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaArrowLeft } from 'react-icons/fa';

function EditItem() {
  const { id: mochilaId, itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: 1,
    categoria: 'alimentos',
    validade: '',
    observacoes: ''
  });
  
  // Verifica se a categoria atual requer data de validade
  const requereValidade = ['alimentos', 'agua', 'medicamentos'].includes(formData.categoria);
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('itens')
          .select('*')
          .eq('id', itemId)
          .single();
          
        if (error) throw error;
        
        setFormData({
          nome: data.nome,
          quantidade: data.quantidade,
          categoria: data.categoria,
          validade: data.validade || '',
          observacoes: data.observacoes || ''
        });
      } catch (error) {
        console.error('Erro ao buscar item:', error.message);
        setError('Não foi possível carregar os dados do item');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [itemId]);
  
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
      
      // Cria um objeto base com os campos obrigatórios
      const updates = {
        nome: formData.nome,
        quantidade: parseInt(formData.quantidade),
        categoria: formData.categoria
      };
      
      // Adiciona campos para categorias específicas
      if (['alimentos', 'agua', 'medicamentos'].includes(formData.categoria)) {
        updates.validade = formData.validade;
      }
      
      // Adiciona observações se preenchido
      if (formData.observacoes) {
        updates.observacoes = formData.observacoes;
      }
      
      const { error } = await supabase
        .from('itens')
        .update(updates)
        .eq('id', itemId);
        
      if (error) throw error;
      
      navigate(`/mochila/${mochilaId}`);
    } catch (error) {
      console.error('Erro ao atualizar item:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !formData.nome) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={() => navigate(`/mochila/${mochilaId}`)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Editar Item</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            
            <div className="mb-4">
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
            
            <div className="mb-4">
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
            
            {/* Mostrar campo de validade para alimentos, água e medicamentos */}
            {requereValidade && (
              <div className="mb-4">
                <label htmlFor="validade" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Validade
                </label>
                <input
                  type="date"
                  id="validade"
                  name="validade"
                  value={formData.validade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required={requereValidade}
                />
              </div>
            )}
            
            {/* Mostrar campo de observações para todas as categorias, obrigatório para 'geral' */}
            <div className="mb-4">
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                {formData.categoria === 'geral' ? 'Observações' : 'Observações (opcional)'}
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required={formData.categoria === 'geral'}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/mochila/${mochilaId}`)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default EditItem;