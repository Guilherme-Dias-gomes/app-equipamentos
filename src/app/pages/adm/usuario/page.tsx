"use client";

import Footer from "@/app/components/footer/page";
import Header from "@/app/components/header/page";
import ProtectedRoute from "@/app/components/ProtectedRoute/ProtectedRoute";
import api from "@/app/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Users {
  id: number;
  nome: string;
  setor: string;
  senha: string;
}

export default function Usuarios() {
  const [error, setError] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [users, setUsers] = useState<Users[]>([]);
  const [editUsers, setEditUsers] = useState<Users | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        setError("Ocorreu um problema, tente mais tarde.");
        console.error("Erro:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (users: Users) => {
    setEditUsers(users);
    setEditSenha(users.senha);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((s) => s.id !== id));
        console.log("Usuário excluída:", id);
      } catch (err) {
        setError("Erro ao excluir usuário.");
        console.error("Erro:", err);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUsers) return;
    try {
      const updatedUser = {
        novaSenha: editSenha
      };
      await api.put(`/auth/users/${editUsers.id}/senha `, updatedUser);
      setUsers(users.map(u =>
        u.id === editUsers.id ? { ...u, senha: editSenha } : u
      ));
      setEditUsers(null);
      setEditSenha("");
      console.log('Solicitação editada:', updatedUser);
    } catch (err) {
      setError('Erro ao editar solicitação.');
      console.error('Erro:', err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="text-black flex flex-col">
        <Header/>
        <div className="bg-white pt-19 h-screen p-20">
          <div className="flex justify-between text-center">
            <h2 className="text-4xl font-bold mb-6">Gerenciar Usuários</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Link href={'/pages/adm/dashboard'} className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 m-5">Voltar</Link>
          </div>
          
          <table className="w-full border-2 shadow-2xl shadow-black">
            <thead className="">
              <tr className="bg-gray-200">
                <th className="p-2 ">ID</th>
                <th className="p-2 ">Nome</th>
                <th className="p-2 ">setor</th>
                <th className="p-2 ">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((users) => (
                <tr
                  key={users.id}
                  className="text-center hover:border hover:bg-[#1e73be]/10">
                  <td className="p-2">{users.id}</td>
                  <td className="p-2">{users.nome}</td>
                  <td className="p-2">{users.setor}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(users)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar Senha
                    </button>
                    <button
                      onClick={() => handleDelete(users.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {editUsers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Editar Solicitação</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label htmlFor="editSenha" className="block text-sm font-medium mb-1">
                    senha
                  </label>
                  <input
                    id="editSenha"
                    type="text"
                    value={editSenha}
                    onChange={(e) => setEditSenha(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditUsers(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <Footer/>
      </div>
    </ProtectedRoute>
  );
}
