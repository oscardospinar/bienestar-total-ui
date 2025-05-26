'use client';

import Image from "next/image";
import LoginForm from '@/components/LoginForm';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-20 grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <LoginForm />
      </main>
    </div>
  );
}
