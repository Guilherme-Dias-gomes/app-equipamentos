'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute/page';
import api from '@/app/lib/axios';
import { jwtDecode } from 'jwt-decode';

interface NovaSolicitacao {
  titulo: string;
  descricao: string;
  status: 'NORMAL' | 'MEDIO' | 'URGENTE';
}

interface JwtPayload {
  roles: string[];
}

export default function NovaSolicitacao() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('NORMAL');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/solicitacao', {
        titulo,
        descricao,
        status,
      });

      // Decodificar o token para verificar a role
      const token = localStorage.getItem('token');
      let redirectPath = '/pages/dashboard'; 
      if (token) {
        const decoded: JwtPayload = jwtDecode(token);
        const roles = decoded.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          redirectPath = '/pages/adm/dashboard';
        }
      }

      //console.log('Solicitação criada:', { titulo, descricao, status });
      router.push(redirectPath);
    } catch (err) {
      setError('Ocorreu um problema, tente mais tarde.');
      console.error('Erro:', err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Nova Solicitação</h2>
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
              Criar Solicitação
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}