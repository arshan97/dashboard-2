import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status-indicator";
import { Zap, Globe } from "lucide-react";

type L3DDoSProtectionProps = {
  tunnelStatuses: {
    akamai: { DCE: string; DCW: string };
    cloudflare: { DCE: string[]; DCW: string[] };
  };
};

export function L3DDoSProtection({ tunnelStatuses }: L3DDoSProtectionProps) {
  // ... existing code ...

  return (
    <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          L3 DDoS Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-2 space-y-4">
        {/* Akamai Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Akamai</h3>
          <div className="space-y-3">
            {Object.entries(tunnelStatuses.akamai).map(
              ([location, status], index) => (
                <div key={location}>
                  {index > 0 && (
                    <div className="flex flex-col items-center my-2">
                      <span className="text-xs font-semibold text-muted-foreground mb-1">
                        DCE
                      </span>
                      <div className="w-full border-t border-border"></div>
                      <span className="text-xs font-semibold text-muted-foreground mt-1">
                        DCW
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                          status === "healthy"
                            ? "bg-emerald-600 dark:bg-emerald-500"
                            : "bg-rose-600 dark:bg-rose-500"
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5 text-black" />
                      </div>
                      <span className="text-[9px] font-medium text-center">
                        {location}
                      </span>
                      <StatusIndicator
                        status={status}
                        size="sm"
                        className="mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Cloudflare Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Cloudflare</h3>
          <div className="space-y-3">
            {Object.entries(tunnelStatuses.cloudflare).map(
              ([location, statuses], index) => (
                <div key={location}>
                  {index > 0 && (
                    <div className="flex flex-col items-center my-2">
                      <span className="text-xs font-semibold text-muted-foreground mb-1">
                        DCE
                      </span>
                      <div className="w-full border-t border-border"></div>
                      <span className="text-xs font-semibold text-muted-foreground mt-1">
                        DCW
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {statuses.map((status, idx) => (
                      <div
                        key={`${location}-${idx}`}
                        className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                            status === "healthy"
                              ? "bg-emerald-600 dark:bg-emerald-500"
                              : "bg-rose-600 dark:bg-rose-500"
                          }`}
                        >
                          <Globe className="h-3.5 w-3.5 text-black" />
                        </div>
                        <span className="text-[9px] font-medium text-center">
                          {location}
                        </span>
                        <StatusIndicator
                          status={status}
                          size="sm"
                          className="mt-0.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
