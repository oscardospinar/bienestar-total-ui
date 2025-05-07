"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface ConfirmacionTurnoProps {
  turno: {
    codigo: string
    especialidad: string
  }
  onNuevoTurno: () => void
}

export default function ConfirmacionTurno({ turno, onNuevoTurno }: ConfirmacionTurnoProps) {
  return (
    <Card className="w-full shadow-lg text-center">
      <CardHeader className="bg-green-50 border-b">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">¡Turno Asignado!</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-4xl font-bold border-4 border-gray-800 rounded-lg px-8 py-4">{turno.codigo}</div>
          <p className="text-lg text-gray-700">
            Su turno para <span className="font-semibold">{turno.especialidad}</span> ha sido registrado
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            Por favor, espere a ser llamado. El tiempo de espera puede variar según la demanda del servicio.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button onClick={onNuevoTurno} variant="outline">
          Solicitar Nuevo Turno
        </Button>
      </CardFooter>
    </Card>
  )
}
