import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import type React from "react";

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "healthy" | "warning" | "critical" | "unknown";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function StatusIndicator({
  status,
  size = "md",
  className,
  ...props
}: StatusIndicatorProps) {
  const icons = {
    healthy: CheckCircle,
    warning: AlertTriangle,
    critical: XCircle,
    unknown: HelpCircle,
  };

  const Icon = icons[status];

  const sizeClasses = {
    xs: "w-2 h-2",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex items-center", className)} {...props}>
      <div
        className={cn("rounded-full", sizeClasses[size], `status-${status}`)}
      >
        {Icon && (
          <Icon
            className={cn(
              "text-black w-full h-full",
              size === "xs" ? "p-0.5" : "p-1"
            )}
          />
        )}
      </div>
    </div>
  );
}
