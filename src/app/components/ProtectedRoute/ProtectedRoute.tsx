'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Role necessária, ex.: 'ADMIN' ou 'USER'
}

interface JwtPayload {
  role?: string; // Role codificada no token, ex.: 'ADMIN' ou 'USER'
  roles?: string[]; // Suporte para arrays de roles
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Iniciando verificação de autenticação para:', pathname, 'RequiredRole:', requiredRole);

      const token = localStorage.getItem('token');

      if (!token) {
        console.log('Nenhum token encontrado, redirecionando para /pages/login');
        router.push('/pages/login');
        setIsLoading(false);
        return;
      }

      if (requiredRole) {
        try {
          const decoded: JwtPayload = jwtDecode(token);
          console.log('Token decodificado:', decoded);

          const userRole = decoded.role || (decoded.roles && decoded.roles[0]) || '';
          const normalizedUserRole = userRole.replace('ROLE_', '');
          console.log('Role do usuário:', normalizedUserRole, 'Role necessária:', requiredRole);

          if (normalizedUserRole !== requiredRole) {
            console.log('Role não autorizada, redirecionando para /unauthorized');
            router.push('/unauthorized');
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          router.push('/pages/login');
          setIsLoading(false);
          return;
        }
      }

      console.log('Acesso autorizado para:', pathname);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}