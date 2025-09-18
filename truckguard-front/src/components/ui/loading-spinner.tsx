interface LoadingSpinnerProps {
    message?: string
    size?: "sm" | "md" | "lg"
}

export default function LoadingSpinner({
    message = "Cargando página...",
    size = "lg"
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-8 h-8 border-2",
        md: "w-16 h-16 border-4",
        lg: "w-32 h-32 border-4"
    }

    return (
        <div className="flex-1 overflow-auto bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                {/* Spinner simple */}
                <div className={`${sizeClasses[size]} border-transparent border-t-blue-400 rounded-full animate-spin`}></div>

                {/* Texto */}
                <p className="text-white text-lg font-medium">{message}</p>
            </div>
        </div>
    )
}
