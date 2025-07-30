'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/app/lib/axios';
import ProtectedRoute from '@/app/components/ProtectedRoute/page';

interface Solicitacao {
  idSolicitacao: number;
  titulo: string;
  descricao: string;
  status: 'NORMAL' | 'MEDIO' | 'URGENTE';
  data: string;
  nomeUsuario: string;
}

export default function Dashboard() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const response = await api.get('/solicitacao');
        console.log('Resposta da API:', response.data);
        setSolicitacoes(response.data);
      } catch (err) {
        setError('Erro ao carregar solicitações.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitacoes();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8 bg-gray-100 text-black">
        <h2 className="text-2xl font-bold mb-6">Minhas Solicitações</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Link href="/pages/solicitacao/nova" className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Nova Solicitação
        </Link>
        <Link href="/perfil/senha" className="mb-4 ml-4 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Alterar Senha
        </Link>
        {loading ? (
          <p>Carregando solicitações...</p>
        ) : solicitacoes.length === 0 ? (
          <p>Nenhuma solicitação encontrada.</p>
        ) : (
          <div className="bg-white rounded shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Título</th>
                  <th className="p-2 text-left">Descrição</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Nome</th>
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
                    <td className="p-2">{solicitacao.nomeUsuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}