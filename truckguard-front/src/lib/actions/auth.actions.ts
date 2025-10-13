"use server"
import { cookies } from "next/headers";
import { RegisterDto, LoginResponse, User } from "@/app/types/auth.types";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${process.env.BACKENDURL}/Auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        if (!response.ok) {
            throw new Error("Failed to login")
        }
        const data: LoginResponse = await response.json()
        const cookieStore = await cookies()
        cookieStore.set("token", data.access_token)
        // Extraer los datos del usuario de la respuesta y guardarlos en una cookie
        const userData: User = {
            id: data.id.toString(),
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: '' // El backend no devuelve phone en el login
        }
        cookieStore.set("user", JSON.stringify(userData))
        return data
    } catch (error) {
        console.error("Error al iniciar sesión:", error)
        throw error
    }
}

export const logout = async () => {
    try {
        const cookieStore = await cookies()
        cookieStore.delete("token")
        cookieStore.delete("user")
        return { success: true }
    } catch (error) {
        console.error("Error al cerrar sesión:", error)
        throw error
    }
}

// Función para obtener los datos del usuario actual
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const cookieStore = await cookies()
        const userCookie = cookieStore.get("user")

        if (!userCookie) {
            return null
        }

        return JSON.parse(userCookie.value) as User
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        return null
    }
}

export const register = async (registerDto: RegisterDto) => {
    try {
        const response = await fetch(`${process.env.BACKENDURL}/Auth/register`, {
            method: "POST",
            body: JSON.stringify(registerDto),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        if (!response.ok) {
            throw new Error("Failed to register")
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error al registrar:", error)
        throw error
    }
}