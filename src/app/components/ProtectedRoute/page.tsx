'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Role necessária, ex.: 'ROLE_ADMIN' ou 'ROLE_USER'
}

interface JwtPayload {
  role: string; 
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      
      // Se não houver token, redireciona para login
      if (!token) {
        router.push(`/pages/login`);
        return;
      }

      // Se a rota exige uma role específica, verifica o token
      if (requiredRole) {
        try {
          const decoded: JwtPayload = jwtDecode(token); // Usa jwtDecode diretamente
          const userRole = decoded.role; // Ajuste conforme a estrutura do seu token

          if (userRole !== requiredRole) {
            // Se a role não corresponder, redireciona para uma página de erro ou login
            router.push('/unauthorized');
            return;
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          router.push('/pages/login');
          return;
        }
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