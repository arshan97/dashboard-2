import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { CDNService } from "@/types/dashboard";
import { Shield } from "@/components/ui/shield";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CDNStatusProps = {
  cdnServices: CDNService[];
  onFlip: (
    source: "akamai" | "cloudflare",
    target: "akamai" | "cloudflare"
  ) => void;
};

export function CDNStatus({ cdnServices, onFlip }: CDNStatusProps) {
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          CDN
          <Shield className="ml-2 h-4 w-4 text-primary" />
          <span className="ml-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            DBS Control
          </span>
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            size="sm"
            onClick={() => onFlip("akamai", "cloudflare")}
            className="text-xs py-1 h-6"
          >
            To Cloudflare
          </Button>
          <Button
            size="sm"
            onClick={() => onFlip("cloudflare", "akamai")}
            className="text-xs py-1 h-6"
          >
            To Akamai
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {["akamai", "cloudflare"].map((provider) => (
            <div key={provider} className="space-y-1">
              <h3 className="text-xs font-medium capitalize">{provider}</h3>
              <div className="space-y-1 -mt-1.5">
                {cdnServices.map((service) => {
                  const serviceStatus =
                    service[provider as keyof typeof service]?.status ||
                    "unknown";
                  const isActive =
                    service[provider as keyof typeof service]?.active || false;

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
                                serviceStatus
                              )} flex items-center justify-center transition-transform hover:scale-110`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${getInnerStatusColor(
                                  isActive
                                )} flex items-center justify-center`}
                              >
                                {isActive && (
                                  <Check className="w-2 h-2 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">
                              {service.name} ({service.code}):{" "}
                              {getStatusText(serviceStatus, isActive)}
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
