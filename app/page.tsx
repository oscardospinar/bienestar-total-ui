import RegistroTurnos from "./components/registro-turnos"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienestar Universitario</h1>
        </div>
        <RegistroTurnos />
      </div>
    </main>
  )
}
