import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Globe } from "lucide-react";

type L3DDoSProtectionProps = {
  tunnelStatuses: {
    akamai: {
      DCE: { ip: string; status: string }[];
      DCW: { ip: string; status: string }[];
    };
    cloudflare: {
      DCE: { ip: string; status: string }[];
      DCW: { ip: string; status: string }[];
    };
  };
};

export function L3DDoSProtection({ tunnelStatuses }: L3DDoSProtectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-600 dark:bg-emerald-500";
      case "warning":
        return "bg-yellow-600 dark:bg-yellow-500";
      case "critical":
        return "bg-rose-600 dark:bg-rose-500";
      default:
        return "bg-gray-600 dark:bg-gray-500";
    }
  };

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
              ([location, tunnels], index) => (
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
                    {tunnels.map((tunnel) => (
                      <div
                        key={tunnel.ip}
                        className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                            tunnel.status
                          )}`}
                        >
                          <Zap className="h-4 w-4 text-black" />
                        </div>
                        <span className="text-[10px] font-medium text-center mt-1">
                          {tunnel.ip}
                        </span>
                      </div>
                    ))}
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
              ([location, tunnels], index) => (
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
                    {tunnels.map((tunnel) => (
                      <div
                        key={tunnel.ip}
                        className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                            tunnel.status
                          )}`}
                        >
                          <Globe className="h-4 w-4 text-black" />
                        </div>
                        <span className="text-[10px] font-medium text-center mt-1">
                          {tunnel.ip}
                        </span>
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
