'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '../../../../../components/ProtectedRoute/page';

export default function AlterarSenhaUsuario() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    // Aqui você adicionará a chamada ao PUT /users/{id}/senha
    console.log({ id, novaSenha });
    router.push('/admin/dashboard');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Alterar Senha do Usuário #{id}</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <input
                type="password"
                id="novaSenha"
                value={novaSenha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNovaSenha(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmarSenha(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Alterar Senha
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}