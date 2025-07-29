'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute/page';

export default function Dashboard() {
  const [solicitacoes] = useState([
    { idSolicitacao: 1, titulo: 'Notebook', descricao: 'Notebook para trabalho remoto', status: 'NORMAL', data: '2025-07-28T10:00:00' },
    { idSolicitacao: 2, titulo: 'Monitor', descricao: 'Monitor 24 polegadas', status: 'URGENTE', data: '2025-07-27T15:30:00' },
  ]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8 bg-gray-100 text-black">
        <h2 className="text-2xl font-bold mb-6">Minhas Solicitações</h2>
        <Link href="/pages/solicitacao/nova" className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Nova Solicitação
        </Link>
        <Link href="/perfil/senha" className="mb-4 ml-4 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Alterar Senha
        </Link>
        <div className="bg-white rounded shadow-md">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Descrição</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((solicitacao) => (
                <tr key={solicitacao.idSolicitacao} className="border-t">
                  <td className="p-2">{solicitacao.idSolicitacao}</td>
                  <td className="p-2">{solicitacao.titulo}</td>
                  <td className="p-2">{solicitacao.descricao}</td>
                  <td className="p-2">{solicitacao.status}</td>
                  <td className="p-2">{new Date(solicitacao.data).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}