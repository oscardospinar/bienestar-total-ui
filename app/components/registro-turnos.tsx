"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../components/ui/command"
import { Checkbox } from "../components/ui/checkbox"
import { cn } from "../lib/utils"
import ConfirmacionTurno from "../components/confirmacion-turno"

// Definición del esquema de validación
const formSchema = z.object({
  nombreCompleto: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  documentoIdentidad: z.string().min(5, {
    message: "El documento debe tener al menos 5 caracteres.",
  }),
  rol: z.enum(["Estudiante", "Docente", "Administrativo", "Servicios Generales"], {
    required_error: "Por favor seleccione un rol.",
  }),
  especialidad: z.enum(["Medicina General", "Odontología", "Psicología"], {
    required_error: "Por favor seleccione una especialidad.",
  }),
  prioridadEspecial: z.object({
    discapacidad: z.boolean().default(false),
    embarazo: z.boolean().default(false),
  }),
})

// Definición de tipo para el formulario basado en el esquema
type FormValues = z.infer<typeof formSchema>

const roles = [
  { label: "Estudiante", value: "Estudiante" },
  { label: "Docente", value: "Docente" },
  { label: "Administrativo", value: "Administrativo" },
  { label: "Servicios Generales", value: "Servicios Generales" },
]

const especialidades = [
  { label: "Medicina General", value: "Medicina General", prefijo: "M" },
  { label: "Odontología", value: "Odontología", prefijo: "O" },
  { label: "Psicología", value: "Psicología", prefijo: "P" },
]

export default function RegistroTurnos() {
  const [turnoAsignado, setTurnoAsignado] = useState<{ codigo: string; especialidad: string } | null>(null)

  // Inicialización del formulario con resolver como any para evitar errores de tipo
  const form = useForm<FormValues>({
    defaultValues: {
      nombreCompleto: "",
      documentoIdentidad: "",
      prioridadEspecial: {
        discapacidad: false,
        embarazo: false,
      },
    },
    // Usamos una aserción de tipo más específica para evitar el error
    resolver: zodResolver(formSchema) as any,
  })

  function onSubmit(values: FormValues) {
    // Generar un número aleatorio entre 1 y 99 para el turno
    const numeroTurno = Math.floor(Math.random() * 99) + 1

    // Obtener el prefijo según la especialidad seleccionada
    const especialidadSeleccionada = especialidades.find((esp) => esp.value === values.especialidad)
    const prefijo = especialidadSeleccionada?.prefijo || "X"

    // Formatear el código del turno (ej. "O-15")
    const codigoTurno = `${prefijo}-${numeroTurno.toString().padStart(2, "0")}`

    // Establecer el turno asignado
    setTurnoAsignado({
      codigo: codigoTurno,
      especialidad: values.especialidad,
    })
  }

  const handleNuevoTurno = () => {
    form.reset()
    setTurnoAsignado(null)
  }

  if (turnoAsignado) {
    return <ConfirmacionTurno turno={turnoAsignado} onNuevoTurno={handleNuevoTurno} />
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle>Registro de Turno</CardTitle>
        <CardDescription>Complete el formulario para solicitar un turno de atención</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombreCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese su nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentoIdentidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento de Identidad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese su número de documento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol en la Institución</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      {roles.map((rol) => (
                        <FormItem key={rol.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={rol.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{rol.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="especialidad"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Especialidad</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? especialidades.find((especialidad) => especialidad.value === field.value)?.label
                            : "Seleccione una especialidad"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar especialidad..." />
                        <CommandList>
                          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                          <CommandGroup>
                            {especialidades.map((especialidad) => (
                              <CommandItem
                                key={especialidad.value}
                                value={especialidad.value}
                                onSelect={() => {
                                  form.setValue("especialidad", especialidad.value as any)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    especialidad.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {especialidad.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prioridadEspecial"
              render={() => (
                <FormItem>
                  <FormLabel>Prioridad Especial</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <FormField
                      control={form.control}
                      name="prioridadEspecial.discapacidad"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">Discapacidad</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prioridadEspecial.embarazo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">Embarazo</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormDescription>Seleccione si aplica alguna condición de prioridad especial</FormDescription>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Solicitar Turno
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
