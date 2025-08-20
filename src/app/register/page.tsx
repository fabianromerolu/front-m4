//src/app/register/page.tsx
"use client"

import RegisterForm from '@/components/RegisterForm';
import PATHROUTES from '@/utils/pathRoutes';
import Link from 'next/link';

const Register = () => {


  return (
    <div className="w-full bg-[var(--color-crema)] flex items-center justify-center p-4">
      <div className="w-full max-w-svh bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-morado)] p-6 text-center">
          <h2 className="text-3xl font-bold text-white font-serif">Formulario de registro</h2>
          <p className="text-[var(--color-rosa)] mt-2">Uneté aquí</p>
        </div>
        <RegisterForm/> 
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            ¿tienes una cuenta?{' '}
            <Link href={PATHROUTES.LOGIN} className="font-medium text-rosa hover:text-morado transition-colors">
              Ingresa aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register