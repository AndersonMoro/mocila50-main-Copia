import React from 'react';
import { FaSuitcase } from 'react-icons/fa'; // Alterado de FaBackpack para FaSuitcase

function MochilaCard({ mochila }) {
  // Formatar a data de criação
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 p-3 rounded-full mr-3">
            <FaSuitcase className="h-6 w-6 text-blue-500" /> {/* Alterado de FaBackpack para FaSuitcase */}
          </div>
          <h3 className="text-lg font-medium text-gray-900 truncate">{mochila.nome}</h3>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          <p>Criada em: {formatarData(mochila.criado_em)}</p>
        </div>
      </div>
    </div>
  );
}

export default MochilaCard;