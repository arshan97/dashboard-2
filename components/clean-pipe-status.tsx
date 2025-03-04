import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { CDNService } from "@/types/dashboard";
import { Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CleanPipeStatusProps = {
  cleanPipeStatuses: {
    akamai: { [key: string]: { status: string; active: boolean } };
    cloudflare: { [key: string]: { status: string; active: boolean } };
  };
  services: CDNService[];
};

export function CleanPipeStatus({
  cleanPipeStatuses,
  services,
}: CleanPipeStatusProps) {
  const getOuterStatusColor = (status: string) => {
    if (status === "critical") return "bg-red-500";
    if (status === "warning") return "bg-yellow-500";
    if (status === "healthy") return "bg-green-500";
    return "bg-gray-500";
  };

  const getInnerStatusColor = (active: boolean) => {
    return active ? "bg-white" : "bg-gray-400";
  };

  const getStatusText = (status: string, active: boolean) => {
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    return `${statusText} ${active ? "(Active)" : "(Inactive)"}`;
  };

  return (
    <Card className="h-full bg-secondary/5 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          Clean Pipe
          <Shield className="ml-auto h-4 w-4 text-primary" />
          <span className="ml-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            DBS Control
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {["akamai", "cloudflare"].map((provider) => (
            <div key={provider} className="space-y-1">
              <h3 className="text-xs font-medium capitalize">{provider}</h3>
              <div className="space-y-1 -mt-1.5">
                {services.map((service) => {
                  const statusData = cleanPipeStatuses[
                    provider as keyof typeof cleanPipeStatuses
                  ][service.code] || {
                    status: "unknown",
                    active: false,
                  };
                  return (
                    <div
                      key={service.code}
                      className="flex items-center justify-center h-7 rounded bg-background/50 -mt-0.5"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={`w-5 h-5 rounded-full ${getOuterStatusColor(
                                statusData.status
                              )} flex items-center justify-center transition-transform hover:scale-110`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${getInnerStatusColor(
                                  statusData.active
                                )} flex items-center justify-center`}
                              >
                                {statusData.active && (
                                  <Check className="w-2 h-2 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">
                              {service.name} ({service.code}):{" "}
                              {getStatusText(
                                statusData.status,
                                statusData.active
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
