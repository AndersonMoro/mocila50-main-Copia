import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useMochilas } from '../hooks/useSupabase';
import Header from '../components/Header';
import MochilaCard from '../components/MochilaCard';
import Button from '../components/common/Button';
import AddMochilaModal from '../components/AddMochilaModal';

function Dashboard() {
  const [mochilas, setMochilas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { fetchMochilas, addMochila, loading: apiLoading, error } = useMochilas(user?.id);

  useEffect(() => {
    if (user) {
      console.log("Usuário autenticado:", user);
      loadMochilas();
    } else {
      console.log("Nenhum usuário autenticado");
    }
  }, [user]);

  async function loadMochilas() {
    try {
      setLoading(true);
      console.log("Carregando mochilas para o usuário:", user?.id);
      const data = await fetchMochilas();
      console.log("Mochilas carregadas:", data);
      setMochilas(data);
    } catch (error) {
      console.error('Erro ao carregar mochilas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMochila(nome) {
    try {
      const novaMochila = await addMochila(nome);
      setMochilas([novaMochila, ...mochilas]);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao adicionar mochila:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Minhas Mochilas" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex justify-end">
          <Button 
            onClick={() => setShowModal(true)}
            variant="primary"
            icon={<FaPlus />}
          >
            Nova Mochila
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {mochilas.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-4">Você ainda não tem nenhuma mochila.</p>
            <Button 
              onClick={() => setShowModal(true)}
              variant="primary"
              icon={<FaPlus />}
            >
              Criar Minha Primeira Mochila
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mochilas.map(mochila => (
              <Link key={mochila.id} to={`/mochila/${mochila.id}`}>
                <MochilaCard mochila={mochila} />
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <AddMochilaModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddMochila}
        loading={apiLoading}
      />
    </div>
  );
}

export default Dashboard;