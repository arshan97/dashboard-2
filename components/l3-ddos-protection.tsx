import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/status-indicator"
import { Zap, Globe } from "lucide-react"

const tunnels = {
  akamai: {
    DCE: [{ ip: "210.79.55.0", status: "healthy" }],
    DCW: [{ ip: "210.79.55.0", status: "healthy" }],
  },
  cloudflare: {
    DCE: [
      { ip: "210.79.57.0", status: "healthy" },
      { ip: "203.124.4.0", status: "healthy" },
      { ip: "103.4.58.0", status: "healthy" },
    ],
    DCW: [
      { ip: "210.79.55.0", status: "healthy" },
      { ip: "103.4.58.0", status: "healthy" },
    ],
  },
}

export function L3DDoSProtection() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          L3 DDoS Protection
          <StatusIndicator status="healthy" size="sm" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-2 space-y-4">
        {/* Akamai Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Akamai</h3>
          <div className="space-y-3">
            {Object.entries(tunnels.akamai).map(([location, ips], index) => (
              <div key={location}>
                {index > 0 && (
                  <div className="flex flex-col items-center my-2">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">DCE</span>
                    <div className="w-full border-t border-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground mt-1">DCW</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {ips.map((tunnel) => (
                    <div
                      key={tunnel.ip}
                      className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                          tunnel.status === "healthy"
                            ? "bg-emerald-600 dark:bg-emerald-500"
                            : "bg-rose-600 dark:bg-rose-500"
                        }`}
                      >
                        <Zap className="h-3.5 w-3.5 text-black" />
                      </div>
                      <span className="text-[9px] font-medium text-center">{tunnel.ip}</span>
                      <StatusIndicator status={tunnel.status} size="sm" className="mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cloudflare Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Cloudflare</h3>
          <div className="space-y-3">
            {Object.entries(tunnels.cloudflare).map(([location, ips], index) => (
              <div key={location}>
                {index > 0 && (
                  <div className="flex flex-col items-center my-2">
                    <span className="text-xs font-semibold text-muted-foreground mb-1">DCE</span>
                    <div className="w-full border-t border-border"></div>
                    <span className="text-xs font-semibold text-muted-foreground mt-1">DCW</span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {ips.map((tunnel) => (
                    <div
                      key={tunnel.ip}
                      className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                          tunnel.status === "healthy"
                            ? "bg-emerald-600 dark:bg-emerald-500"
                            : "bg-rose-600 dark:bg-rose-500"
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5 text-black" />
                      </div>
                      <span className="text-[9px] font-medium text-center">{tunnel.ip}</span>
                      <StatusIndicator status={tunnel.status} size="sm" className="mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

