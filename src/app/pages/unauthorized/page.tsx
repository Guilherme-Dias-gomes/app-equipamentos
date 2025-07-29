'use client';

import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Acesso Não Autorizado</h2>
        <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}