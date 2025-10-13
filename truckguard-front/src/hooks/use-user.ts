"use client"

import { useState, useEffect } from 'react'
import { User } from '@/app/types/auth.types'

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Obtener datos del usuario desde las cookies del lado del cliente
                const userCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('user='))

                if (userCookie) {
                    const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
                    setUser(userData)
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const updateUser = (userData: User | null) => {
        setUser(userData)
    }

    return { user, loading, updateUser }
}
