import { FaUtensils, FaTools, FaSoap, FaFileAlt, FaEllipsisH } from 'react-icons/fa';
import React from 'react';

export const CATEGORIA_INFO = {
  alimentos: { nome: 'Alimentos', showValidade: true },
  ferramentas: { nome: 'Ferramentas', showValidade: false },
  higiene: { nome: 'Higiene e Limpeza', showValidade: false },
  documentos: { nome: 'Documentos', showValidade: false },
  outros: { nome: 'Outros', showValidade: false }
};

export const CATEGORIAS = [
  { id: 'alimentos', nome: 'Alimentos', icon: <FaUtensils className="h-5 w-5" /> },
  { id: 'ferramentas', nome: 'Ferramentas', icon: <FaTools className="h-5 w-5" /> },
  { id: 'higiene', nome: 'Higiene e Limpeza', icon: <FaSoap className="h-5 w-5" /> },
  { id: 'documentos', nome: 'Documentos', icon: <FaFileAlt className="h-5 w-5" /> },
  { id: 'outros', nome: 'Outros', icon: <FaEllipsisH className="h-5 w-5" /> }
];