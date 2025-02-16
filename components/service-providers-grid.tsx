"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "./status-indicator"
import type { ServiceProvider } from "@/types/dashboard"

const providers: ServiceProvider[] = [
  {
    name: "SingTel",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "healthy" },
      { name: "Mobile Banking", code: "MBS", status: "healthy" },
      { name: "PayLah", code: "P2P-SG", status: "healthy" },
      { name: "iWealth", code: "IWSM", status: "healthy" },
      { name: "IDEAL", code: "IDEAL", status: "healthy" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
    ],
  },
  {
    name: "StarHub",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "unknown" },
      { name: "Mobile Banking", code: "MBS", status: "unknown" },
      { name: "PayLah", code: "P2P-SG", status: "unknown" },
      { name: "iWealth", code: "IWSM", status: "unknown" },
      { name: "IDEAL", code: "IDEAL", status: "unknown" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "unknown" },
    ],
  },
  {
    name: "M1",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "healthy" },
      { name: "Mobile Banking", code: "MBS", status: "healthy" },
      { name: "PayLah", code: "P2P-SG", status: "warning" },
      { name: "iWealth", code: "IWSM", status: "healthy" },
      { name: "IDEAL", code: "IDEAL", status: "healthy" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
    ],
  },
  {
    name: "Others",
    services: [
      { name: "Internet Banking", code: "IBBR", status: "healthy" },
      { name: "Mobile Banking", code: "MBS", status: "healthy" },
      { name: "PayLah", code: "P2P-SG", status: "healthy" },
      { name: "iWealth", code: "IWSM", status: "healthy" },
      { name: "IDEAL", code: "IDEAL", status: "healthy" },
      { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
    ],
  },
]

export function ServiceProvidersGrid() {
  // Get unique service names for rows
  const serviceNames = providers[0].services.map((service) => ({
    name: service.name,
    code: service.code,
  }))

  return (
    <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-base font-medium">
          End User Experience on different Service Providers in SG
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-2">
        <div className="w-full">
          {/* Header Row */}
          <div className="grid grid-cols-5 gap-1 mb-1">
            <div className="text-sm font-medium text-muted-foreground">Services</div>
            {providers.map((provider) => (
              <div key={provider.name} className="text-sm font-medium text-center">
                {provider.name}
              </div>
            ))}
          </div>

          {/* Service Rows */}
          {serviceNames.map((service) => (
            <div key={service.code} className="grid grid-cols-5 gap-1 py-1 border-t border-border/30 first:border-t-0">
              <div className="flex flex-col pr-2">
                <span className="text-xs font-medium">{service.name}</span>
                <span className="text-[9px] text-muted-foreground">({service.code})</span>
              </div>
              {providers.map((provider) => {
                const providerService = provider.services.find((s) => s.code === service.code)
                return (
                  <div key={`${provider.name}-${service.code}`} className="flex justify-center items-center">
                    <StatusIndicator status={providerService?.status || "unknown"} size="sm" />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

