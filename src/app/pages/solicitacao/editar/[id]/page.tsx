'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute/page';

export default function EditarSolicitacao() {
  const [titulo, setTitulo] = useState('Notebook'); // Exemplo de dado inicial
  const [descricao, setDescricao] = useState('Notebook para trabalho remoto');
  const [status, setStatus] = useState('NORMAL');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aqui você adicionará a chamada ao PUT /solicitacao/{id}
    console.log({ id, titulo, descricao, status });
    router.push('/admin/dashboard');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Editar Solicitação #{id}</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescricao(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="NORMAL">Normal</option>
                <option value="MEDIO">Médio</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}