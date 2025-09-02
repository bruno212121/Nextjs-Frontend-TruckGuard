"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Truck, Eye, EyeOff, Shield } from "lucide-react"
import { login } from "@/lib/actions/auth.actions"
import Link from "next/link" 
import { useRouter } from "next/navigation" 

const loginSchema = z.object({
    email: z.string().email("Por favor ingresa un email válido"),
    password: z.string().min(3, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginFormValues) {
        setIsLoading(true)
        try {
            // Aquí iría la lógica de autenticación
            console.log("Datos del formulario:", values)
            const response = await login(values.email, values.password)
            console.log("Respuesta del servidor:", response)
            
            router.push('/dashboard')

            // Redirigir al dashboard después del login exitoso
            // router.push('/dashboard')
        } catch (error) {
            console.error("Error en el login:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Header con logo */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 transition-transform duration-200">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Truck className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                TruckGuard
                            </h1>
                        </div>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gestión inteligente de flota
                    </p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Iniciar Sesión
                        </CardTitle>
                        <CardDescription className="text-center">
                            Accede a tu panel de control de flota
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="tu@email.com"
                                                    type="email"
                                                    {...field}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="••••••••"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                        className="h-11 pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                                            Recordarme
                                        </Label>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Iniciando sesión...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4" />
                                            <span>Iniciar Sesión</span>
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ¿No tienes una cuenta?{" "}
                                <Link href="/auth/register">
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-0 h-auto"
                                    >
                                        Registrarse
                                    </Button>
                                </Link>

                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer con información de seguridad */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Shield className="h-3 w-3" />
                        <span>Conexión segura SSL</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        © 2024 TruckGuard. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    )
}
