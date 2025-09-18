"use server"
import { cookies } from "next/headers";
import { RegisterDto } from "@/app/types/auth.types";

export const login = async (email: string, password: string) => {
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
        const data = await response.json()
        const cookieStore = await cookies()
        cookieStore.set("token", data.access_token)
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
        return { success: true }
    } catch (error) {
        console.error("Error al cerrar sesión:", error)
        throw error
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