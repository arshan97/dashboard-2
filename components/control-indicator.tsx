import { Shield, Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ControlIndicatorProps = {
  type: "dbs" | "external";
  className?: string;
};

export function ControlIndicator({
  type,
  className = "",
}: ControlIndicatorProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center ${className}`}>
            {type === "dbs" ? (
              <Shield className="h-4 w-4 text-primary" />
            ) : (
              <Globe className="h-4 w-4 text-orange-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{type === "dbs" ? "DBS Controlled" : "External Provider"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
