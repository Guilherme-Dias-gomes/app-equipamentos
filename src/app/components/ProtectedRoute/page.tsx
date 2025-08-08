'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Role necessária, ex.: 'ADMIN' ou 'USER'
}

interface JwtPayload {
  role?: string; // Role codificada no token, ex.: 'ADMIN' ou 'USER'
  roles?: string[]; // Para suportar arrays de roles, caso o token use 'roles'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Iniciando verificação de autenticação para:', pathname, 'RequiredRole:', requiredRole);

      const token = localStorage.getItem('token');
      
      // Se não houver token, redireciona para login
      if (!token) {
        console.log('Nenhum token encontrado, redirecionando para /pages/login');
        router.push('/pages/login');
        return;
      }

      // Verifica se a rota exige uma role específica
      if (requiredRole) {
        console.log('Verificando role necessária:', requiredRole);
        try {
          const decoded: JwtPayload = jwtDecode(token);
          console.log('Token decodificado:', decoded);

          // Extrai a role do token (suporta 'role' ou 'roles')
          const userRole = decoded.role || (decoded.roles && decoded.roles[0]) || '';
          const normalizedUserRole = userRole.replace('ROLE_', ''); // Remove prefixo 'ROLE_' se existir
          console.log('Role do usuário:', normalizedUserRole, 'Role necessária:', requiredRole);

          // Verifica se a role do usuário corresponde à role necessária
          if (normalizedUserRole !== requiredRole) {
            console.log('Role não autorizada, redirecionando para /unauthorized');
            router.push('/unauthorized');
            return;
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          router.push('/pages/login');
          return;
        }
      } else {
        console.log('Nenhuma role específica exigida para:', pathname);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname, requiredRole]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return <>{children}</>;
}