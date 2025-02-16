import { cn } from "@/lib/utils"
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react"

interface StatusIndicatorProps {
  status: "healthy" | "warning" | "critical" | "unknown"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusIndicator({ status, size = "md", className }: StatusIndicatorProps) {
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    critical: XCircle,
    unknown: HelpCircle,
  }

  const Icon = icons[status]

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const colors = {
    healthy: "bg-emerald-600 dark:bg-emerald-500",
    warning: "bg-amber-600 dark:bg-amber-500",
    critical: "bg-rose-600 dark:bg-rose-500",
    unknown: "bg-slate-600 dark:bg-slate-500",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("rounded-full", sizeClasses[size], colors[status])}>
        <Icon className="text-black w-full h-full p-0.5" />
      </div>
    </div>
  )
}

