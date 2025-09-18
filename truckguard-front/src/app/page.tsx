"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Truck, Shield, BarChart3, ArrowRight, Menu, X, Sun, Moon, TrendingUp, Clock } from "lucide-react"

export default function TruckGuardLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800">
      <header className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-white">TruckGuard</h1>
                <p className="text-xs text-slate-300">Gestión inteligente de flota</p>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white hover:bg-slate-700/50">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-slate-100 text-slate-800 hover:bg-white">Registrarse</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700">
              <nav className="flex flex-col gap-4">
                <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-slate-700/50">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-slate-100 text-slate-800 hover:bg-white">Registrarse</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <section className="py-20 lg:py-32 bg-gradient-to-r from-slate-900/80 to-gray-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Mantenimiento Inteligente
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-white text-balance leading-tight">
                  Gestiona tu flota con <span className="text-slate-300">inteligencia</span>
                </h1>
                <p className="text-xl text-slate-300 text-pretty leading-relaxed">
                  TruckGuard revoluciona la gestión de flotas con mantenimiento preventivo automatizado, análisis en
                  tiempo real y optimización de costos. Evita reparaciones costosas y maximiza la disponibilidad de tus
                  vehículos.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img
                  src='logo-truckguard.png'
                  alt="Camión de carga TruckGuard"
                  className="w-full h-auto max-w-lg mx-auto filter brightness-125 contrast-110 saturate-0 opacity-90 mix-blend-screen"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 via-gray-600/20 to-slate-800/30 rounded-full blur-3xl transform scale-110 -rotate-12"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-slate-600/40 via-transparent to-gray-700/30 rounded-full blur-2xl transform scale-90 rotate-6"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-700/20 rounded-full blur-xl"></div>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gray-600/30 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-800/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Component Details */}
          <div className="mt-20 bg-gradient-to-r from-slate-800/80 to-gray-800/60 rounded-2xl p-6 lg:p-12 border border-slate-700">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-white">Monitoreo Inteligente de Componentes</h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Nuestro sistema supervisa los componentes críticos de tus camiones para prevenir fallos costosos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
              {[
                { name: "Filtros", interval: "10,000-15,000 km", icon: "🔧" },
                { name: "Aceite", interval: "20,000-30,000 km", icon: "🛢️" },
                { name: "Inyectores", interval: "8,000-10,000 km", icon: "⚡" },
                { name: "Frenos", interval: "9,000-15,000 km", icon: "🛑" },
                { name: "Neumáticos", interval: "40,000-50,000 km", icon: "🛞" },
              ].map((component, index) => (
                <div key={index} className="text-center p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                  <div className="text-3xl mb-2">{component.icon}</div>
                  <h4 className="font-semibold text-white mb-1">{component.name}</h4>
                  <p className="text-sm text-slate-300">{component.interval}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">TruckGuard</span>
              </div>
              <p className="text-slate-300 text-sm">Gestión inteligente de flotas para empresas modernas.</p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-300 text-sm">© 2025 TruckGuard. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
