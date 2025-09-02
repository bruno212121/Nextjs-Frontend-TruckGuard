"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface AlertDialogTriggerProps {
  children: React.ReactNode
  onClick?: () => void
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogFooterProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

interface AlertDialogActionProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive"
}

interface AlertDialogCancelProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80 animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg">
        {children}
      </div>
    </div>
  )
}

AlertDialog.Trigger = ({ children, onClick }: AlertDialogTriggerProps) => (
  <div onClick={onClick}>
    {children}
  </div>
)

AlertDialog.Content = ({ children, className = "" }: AlertDialogContentProps) => (
  <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-in zoom-in-95 ${className}`}>
    <button
      onClick={() => {
        // Close dialog logic will be handled by parent
      }}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <X className="h-4 w-4" />
    </button>
    {children}
  </div>
)

AlertDialog.Header = ({ children, className = "" }: AlertDialogHeaderProps) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
    {children}
  </div>
)

AlertDialog.Footer = ({ children, className = "" }: AlertDialogFooterProps) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6 ${className}`}>
    {children}
  </div>
)

AlertDialog.Title = ({ children, className = "" }: AlertDialogTitleProps) => (
  <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h2>
)

AlertDialog.Description = ({ children, className = "" }: AlertDialogDescriptionProps) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 mt-2 ${className}`}>
    {children}
  </p>
)

AlertDialog.Action = ({ children, onClick, className = "", variant = "default" }: AlertDialogActionProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

  const variantClasses = variant === "destructive"
    ? "bg-red-600 text-white hover:bg-red-700"
    : "bg-blue-600 text-white hover:bg-blue-700"

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} h-10 py-2 px-4 ${className}`}
    >
      {children}
    </button>
  )
}

AlertDialog.Cancel = ({ children, onClick, className = "" }: AlertDialogCancelProps) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 h-10 py-2 px-4 mt-2 sm:mt-0 ${className}`}
  >
    {children}
  </button>
)

// Crear componentes individuales para exportar
const AlertDialogTrigger = AlertDialog.Trigger
const AlertDialogContent = AlertDialog.Content
const AlertDialogHeader = AlertDialog.Header
const AlertDialogFooter = AlertDialog.Footer
const AlertDialogTitle = AlertDialog.Title
const AlertDialogDescription = AlertDialog.Description
const AlertDialogAction = AlertDialog.Action
const AlertDialogCancel = AlertDialog.Cancel

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
