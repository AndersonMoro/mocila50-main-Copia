import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

function Header({ title, showBackButton = false, backPath = '/', mochilaId }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  const categorias = [
    { id: 'alimentos', nome: 'Alimentos' },
    { id: 'agua', nome: 'Água' },
    { id: 'medicamentos', nome: 'Medicamentos' },
    { id: 'higiene', nome: 'Higiene' },
    { id: 'documentos', nome: 'Documentos' },
    { id: 'ferramentas', nome: 'Ferramentas' },
    { id: 'roupas', nome: 'Roupas' },
    { id: 'geral', nome: 'Geral' }
  ];

  const navigateToCategory = (categoriaId) => {
    if (mochilaId) {
      navigate(`/mochila/${mochilaId}/add-item/${categoriaId}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Versão para desktop */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={() => navigate(backPath)}
                className="mr-4 text-gray-500 hover:text-gray-700"
                aria-label="Voltar"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-500 hover:text-gray-700"
            title="Sair"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="ml-1">Sair</span>
          </button>
        </div>

        {/* Versão para mobile */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {showBackButton && (
                <button
                  onClick={() => navigate(backPath)}
                  className="mr-3 text-gray-500 hover:text-gray-700"
                  aria-label="Voltar"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px]">{title}</h1>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-500 hover:text-gray-700"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Menu mobile */}
          {menuOpen && (
            <div className="mt-4 py-2 border-t border-gray-200">
              {mochilaId && (
                <div className="py-2">
                  <h2 className="text-sm font-medium text-gray-900 mb-2">Categorias</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {categorias.map((categoria) => (
                      <button
                        key={categoria.id}
                        onClick={() => navigateToCategory(categoria.id)}
                        className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        {categoria.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 text-gray-500 hover:text-gray-700"
                >
                  <FaSignOutAlt className="h-5 w-5 mr-2" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;