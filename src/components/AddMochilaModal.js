import React, { useState } from 'react';
import Button from './common/Button';
import { FaTimes } from 'react-icons/fa';

function AddMochilaModal({ isOpen, onClose, onAdd, loading }) {
  const [nome, setNome] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim()) {
      onAdd(nome);
      setNome('');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Nova Mochila</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Mochila
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Mochila de Emergência"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              variant="primary"
              disabled={!nome.trim() || loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMochilaModal;