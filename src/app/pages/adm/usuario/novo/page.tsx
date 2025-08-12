'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute/ProtectedRoute';
import api from '@/app/lib/axios';

export default function NovoUsuario() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        email,
        senha,
        nome,
        setor,
        role
      });
    } catch (err) {
        setError('Ocorreu um problema, tente mais tarde.');
        console.error('Erro:', err);
    }
    console.log({ email, senha, nome, setor, role });
    router.push('/pages/adm/dashboard');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-blackd text-black">
        <div className="bg-white p-8 rounded shadow-2xl shadow-black w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1e73be]">Criar Novo Usuário</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="setor" className="block text-sm font-medium text-gray-700">
                Setor
              </label>
              <input
                type="text"
                id="setor"
                value={setor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSetor(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="USER">Usuário</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Criar Usuário
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}