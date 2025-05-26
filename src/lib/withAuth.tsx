'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type UserRole = 'ADMIN' | 'STUDENT' | 'GENERALSERVICES' | 'TEACHER';

type Props = {
  allowedRoles: UserRole[];
};


type DecodedToken = {
  id: string;
  role: UserRole;
  exp: number;
};

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  { allowedRoles }: Props
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/');
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);


        if (!allowedRoles.includes(decoded.role)) {
          router.push('/no-autorizado');
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error('Token inválido', err);
        router.push('/');
      }
    }, []);

    if (!authorized) {
      return null;
    }

    return <Component {...props} />;
  };
}