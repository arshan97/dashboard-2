"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status-indicator";
import type { ServiceProvider, CDNService } from "@/types/dashboard";
import { Shield } from "lucide-react";

type ServiceProvidersGridProps = {
  providers: ServiceProvider[];
  services: CDNService[];
};

export function ServiceProvidersGrid({
  providers,
  services,
}: ServiceProvidersGridProps) {
  return (
    <Card className="h-full relative overflow-hidden border-l-4 border-l-orange-500">
      <div className="absolute inset-0 bg-grid-orange/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          Service Providers
          <Shield className="ml-auto h-4 w-4 text-orange-500" />
          <span className="ml-1.5 text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full">
            External
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 relative z-10">
        <div className="grid grid-cols-3 gap-2">
          {providers.map((provider) => (
            <div key={provider.name} className="space-y-1">
              <h3 className="text-xs font-medium">{provider.name}</h3>
              <div className="space-y-1 -mt-1.5">
                {services.map((service) => (
                  <div
                    key={service.code}
                    className="flex items-center justify-center h-7 bg-background/80 rounded -mt-0.5"
                  >
                    <StatusIndicator
                      status={
                        provider.services.find((s) => s.code === service.code)
                          ?.status || "unknown"
                      }
                      size="xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
