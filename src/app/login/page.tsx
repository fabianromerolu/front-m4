"use client"

import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext';
import PATHROUTES from '@/utils/pathRoutes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Login = () => {
  const { dataUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (dataUser) {
      router.push(PATHROUTES.DASHBOARD);
    }
  }, [dataUser, router]);

  if (dataUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[var(--color-crema)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-morado)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-crema)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[var(--color-morado)] p-6 text-center">
          <h2 className="text-3xl font-bold text-white font-serif">Bienvenido</h2>
          <p className="text-[var(--color-rosa)] mt-2">Ingresa tus credenciales</p>
        </div>
        <LoginForm/> 
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href={PATHROUTES.REGISTER} className="font-medium text-rosa hover:text-morado transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;