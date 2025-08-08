"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/app/lib/axios";
import ProtectedRoute from "@/app/components/ProtectedRoute/page";
import Header from "@/app/components/header/page";
import Footer from "@/app/components/footer/page";

interface Solicitacao {
  idSolicitacao: number;
  titulo: string;
  descricao: string;
  status: "NORMAL" | "MEDIO" | "URGENTE";
  data: string;
  nomeUsuario: string;
  concluida: boolean;
}

export default function Dashboard() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editSolicitacao, setEditSolicitacao] = useState<Solicitacao | null>(
    null
  );
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editStatus, setEditStatus] = useState<"NORMAL" | "MEDIO" | "URGENTE">(
    "NORMAL"
  );
  const [editConcluido, setEditConcluido] = useState(false);

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const response = await api.get("/solicitacao");
        console.log("Resposta da API:", response.data);
        setSolicitacoes(response.data);
      } catch (err) {
        setError("Erro ao carregar solicitações.");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitacoes();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta solicitação?")) {
      try {
        await api.delete(`/solicitacao/${id}`);
        setSolicitacoes(solicitacoes.filter((s) => s.idSolicitacao !== id));
        console.log("Solicitação excluída:", id);
      } catch (err) {
        setError("Erro ao excluir solicitação.");
        console.error("Erro:", err);
      }
    }
  };

  const handleEdit = (solicitacao: Solicitacao) => {
    setEditSolicitacao(solicitacao);
    setEditTitulo(solicitacao.titulo);
    setEditDescricao(solicitacao.descricao);
    setEditStatus(solicitacao.status);
    setEditConcluido(solicitacao.concluida);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editSolicitacao) return;
    try {
      const updatedSolicitacao = {
        titulo: editTitulo,
        descricao: editDescricao,
        status: editStatus,
        concluida: editConcluido,
      };
      await api.put(
        `/solicitacao/${editSolicitacao.idSolicitacao}`,
        updatedSolicitacao
      );
      setSolicitacoes(
        solicitacoes.map((s) =>
          s.idSolicitacao === editSolicitacao.idSolicitacao
            ? { ...s, ...updatedSolicitacao }
            : s
        )
      );
      setEditSolicitacao(null);
      console.log("Solicitação editada:", updatedSolicitacao);
    } catch (err) {
      setError("Erro ao editar solicitação.");
      console.error("Erro:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 text-black">
        <Header/>
        <div className="p-10 pt-19">
          <h2 className="text-2xl font-bold mb-6">Painel do Administrador</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Link
            href="/pages/solicitacao/nova"
            className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Nova Solicitação
          </Link>
          <Link
            href="/pages/adm/usuario/novo"
            className="mb-4 ml-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Criar Usuário
          </Link>
          <Link
            href="/pages/adm/usuario"
            className="mb-4 ml-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Usuarios
          </Link>
        </div>
        {loading ? (
          <p className="p-10">Carregando solicitações...</p>
        ) : solicitacoes.length === 0 ? (
          <p className="p-10">Nenhuma solicitação encontrada.</p>
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
                  <th className="p-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoes.map((solicitacao) => (
                  <tr
                    key={solicitacao.idSolicitacao}
                    className={`border-t ${
                      solicitacao.concluida ? "bg-green-100" : ""
                    }`}
                  >
                    <td className="p-2">{solicitacao.idSolicitacao}</td>
                    <td className="p-2">{solicitacao.titulo}</td>
                    <td className="p-2">{solicitacao.descricao}</td>
                    <td className="p-2">{solicitacao.status}</td>
                    <td className="p-2">
                      {new Date(solicitacao.data).toLocaleString()}
                    </td>
                    <td className="p-2">{solicitacao.nomeUsuario}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(solicitacao)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(solicitacao.idSolicitacao)}
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
        )}
        {editSolicitacao && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-2xl shadow-black max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-[#1e73be]">Editar Solicitação</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="editTitulo"
                    className="block text-sm font-medium mb-1"
                  >
                    Título
                  </label>
                  <input
                    id="editTitulo"
                    type="text"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="editDescricao"
                    className="block text-sm font-medium mb-1"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="editDescricao"
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="editStatus"
                    className="block text-sm font-medium mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="editStatus"
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(
                        e.target.value as "NORMAL" | "MEDIO" | "URGENTE"
                      )
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="MEDIO">Médio</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <h1>CONCLUIDA?</h1>
                  <input
                    type="checkbox"
                    checked={editConcluido}
                    onChange={(e) => setEditConcluido(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditSolicitacao(null)}
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
