import type React from "react"
import type { Metadata } from "next"
import { Ubuntu } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import logo from "../public/images/EciLogo.jpeg"
import Image from "next/image"
import "./globals.css"

// Configuración de la fuente Inter como alternativa
const ubuntu = Ubuntu({ subsets: ["latin"], variable: "--font-ubuntu", weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: "Bienestar Universitario",
  description: "Sistema de Gestión de Bienestar Universitario - Escuela Colombiana de Ingeniería Julio Garavito",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} ${ubuntu.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
      <header className="w-full p-4 flex items-center justify-center border-b border-gray-200 bg-white">
          <Image
            src={logo}
            alt="Logo Escuela Colombiana de Ingeniería"
            width={200}
            height={200}
            priority
          />
        </header>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}
