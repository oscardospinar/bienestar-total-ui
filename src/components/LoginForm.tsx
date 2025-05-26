'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/user';
import Image from 'next/image';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = await loginUser(correo, contraseña);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', correo);
      const [, payloadBase64] = token.split('.');
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const rol = decodedPayload.role;

      if (rol === 'ADMIN') {
        router.push('/sportLoans/adminPage');
      } else if (rol === 'GENERALSERVICES') {
        router.push('/sportLoans/generalServicesPage');
      } else if (rol === 'STUDENT' || rol === 'TEACHER') {
        router.push('/sportLoans/userPage');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isDisabled = !correo || !contraseña;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded shadow-sm space-y-4">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/resources/LOGO.png"
          alt="Logo Institucional"
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>

      <h2 className="text-xl font-bold text-[#990000] mb-2">Acceso Institucional</h2>
      <p className="text-sm text-gray-600 mb-6">Ingrese sus credenciales para acceder al sistema</p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="text-sm font-medium text-[#990000]">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingrese su correo"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
            required
          />

        </div>

        <div>
          <label className="text-sm font-medium text-[#990000]">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            placeholder="Ingrese su contraseña"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md outline-none text-gray-600 placeholder-gray-600"
            required
          />

        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-2 rounded-md font-semibold transition ${
            isDisabled
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-[#990000] text-white hover:bg-red-600 hover:text-black'
          }`}
        >
          Iniciar Sesión
        </button>
      </form>

      <p className="text-xs text-gray-600 mt-6">
        Al iniciar sesión, acepta nuestros{' '}
        <a href="#" className="text-[#990000] underline">
          Términos de Servicio
        </a>{' '}
        y{' '}
        <a href="#" className="text-[#990000] underline">
          Política de Privacidad
        </a>
        .
      </p>
    </div>
  );
}
