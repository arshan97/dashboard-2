"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusIndicator } from "@/components/status-indicator"
import {
  Globe,
  Shield,
  Cloud,
  ArrowRight,
  Smartphone,
  CreditCard,
  BarChart3,
  Building2,
  Tablet,
  Star,
  Zap,
  ShieldIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { L3DDoSProtection } from "@/components/l3-ddos-protection"
import { DBSGateway } from "@/components/dbs-gateway"
import { ServiceProvidersGrid } from "@/components/service-providers-grid"
import type { BankingService, DDoSProtection, CDNService } from "@/types/dashboard"

const dnsServices: BankingService[] = [
  { name: "Internet Banking", code: "IBBR", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", status: "healthy" },
  { name: "iWealth", code: "IWSM", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", status: "healthy" },
  { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
]

const ddosProtection: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "healthy" },
  { name: "Nexus Guard", enabled: true, status: "critical" },
]

const cdnServices: CDNService[] = [
  {
    name: "Internet Banking",
    code: "IBBR",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "Mobile Banking",
    code: "MBS",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "warning", active: false },
  },
  {
    name: "iWealth",
    code: "IWSM",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "IDEAL",
    code: "IDEAL",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "critical", active: false },
  },
  {
    name: "IDEAL Mobile",
    code: "IDEAL-M",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "PayLah",
    code: "P2P-SG",
    akamai: { status: "warning", active: false },
    cloudflare: { status: "healthy", active: true },
  },
]

type FlipStep = "select" | "summary" | "confirm"

type FlipDialogState = {
  isOpen: boolean
  step: FlipStep
  source: "akamai" | "cloudflare" | null
  target: "akamai" | "cloudflare" | null
  selectedServices: string[]
}

export default function DashboardPage() {
  const [services, setServices] = useState(cdnServices)
  const [flipDialog, setFlipDialog] = useState<FlipDialogState>({
    isOpen: false,
    step: "select",
    source: null,
    target: null,
    selectedServices: [],
  })
  const { toast } = useToast()

  const handleFlip = (source: "akamai" | "cloudflare", target: "akamai" | "cloudflare") => {
    setFlipDialog({
      isOpen: true,
      step: "select",
      source,
      target,
      selectedServices: services.filter((s) => s[source].active).map((s) => s.code),
    })
  }

  const handleServiceSelect = (code: string) => {
    setFlipDialog((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(code)
        ? prev.selectedServices.filter((c) => c !== code)
        : [...prev.selectedServices, code],
    }))
  }

  const handleNextStep = () => {
    setFlipDialog((prev) => ({
      ...prev,
      step: prev.step === "select" ? "summary" : "confirm",
    }))
  }

  const handlePrevStep = () => {
    setFlipDialog((prev) => ({
      ...prev,
      step: prev.step === "summary" ? "select" : "summary",
    }))
  }

  const submitFlipRequest = () => {
    console.log("Submitting flip request:", flipDialog)

    toast({
      title: "Flip Request Submitted",
      description: `Request to flip ${flipDialog.selectedServices.length} services from ${flipDialog.source} to ${flipDialog.target} has been submitted for approval.`,
    })

    setFlipDialog({
      isOpen: false,
      step: "select",
      source: null,
      target: null,
      selectedServices: [],
    })
  }

  return (
    <div className="container mx-auto p-6 overflow-x-auto min-w-[1200px]">
      <div className="flex space-x-6">
        {/* Service Providers Grid */}
        <div className="w-1/3">
          <ServiceProvidersGrid />
        </div>

        {/* Right side components */}
        <div className="w-2/3 space-y-6">
          {/* DNS Records and DNS Provider */}
          <div className="grid gap-6 md:grid-cols-2 relative">
            {/* DNS Records */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-2">
                <CardTitle className="text-base font-medium">DNS Records</CardTitle>
                <Globe className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent className="px-2 py-2">
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {dnsServices.map((service) => (
                    <div
                      key={service.code}
                      className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          service.status === "healthy"
                            ? "bg-emerald-600 dark:bg-emerald-500"
                            : "bg-rose-600 dark:bg-rose-500"
                        }`}
                      >
                        {service.code === "IBBR" && <Globe className="h-4 w-4 text-black" />}
                        {service.code === "MBS" && <Smartphone className="h-4 w-4 text-black" />}
                        {service.code === "P2P-SG" && <CreditCard className="h-4 w-4 text-black" />}
                        {service.code === "IWSM" && <BarChart3 className="h-4 w-4 text-black" />}
                        {service.code === "IDEAL" && <Building2 className="h-4 w-4 text-black" />}
                        {service.code === "IDEAL-M" && <Tablet className="h-4 w-4 text-black" />}
                      </div>
                      <span className="text-xs font-medium text-center">{service.name}</span>
                      <span className="text-[9px] text-muted-foreground">{service.code}</span>
                      <StatusIndicator status={service.status} size="sm" className="mt-0.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="hidden md:flex absolute left-[calc(50%-4rem)] top-1/2 -translate-y-1/2 items-center justify-center w-32 z-10">
              <ArrowRight className="h-8 w-20 text-primary/50" />
            </div>
            {/* DNS Provider */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-2">
                <CardTitle className="text-base font-medium">DNS Provider</CardTitle>
                <Shield className="h-4 w-4 text-black" />
              </CardHeader>
              <CardContent className="px-2 py-2">
                <div className="space-y-2">
                  {ddosProtection.map((protection) => (
                    <div
                      key={protection.name}
                      className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            protection.status === "healthy"
                              ? "bg-emerald-600 dark:bg-emerald-500"
                              : "bg-rose-600 dark:bg-rose-500"
                          }`}
                        >
                          {protection.name === "StarHub" && <Star className="h-4 w-4 text-black" />}
                          {protection.name === "Akamai" && <Zap className="h-4 w-4 text-black" />}
                          {protection.name === "Nexus Guard" && <ShieldIcon className="h-4 w-4 text-black" />}
                        </div>
                        <span className="text-sm font-medium">{protection.name}</span>
                      </div>
                      <StatusIndicator status={protection.status} size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CDN Management, L3 DDoS, and DBS Gateway */}
          <div className="grid gap-6 md:grid-cols-3 relative">
            {/* CDN Management */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-black" />
                  CDN Management
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-2">
                <div className="grid gap-4">
                  {/* Akamai Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Akamai</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {services.map((service) => (
                        <div
                          key={`akamai-${service.code}`}
                          className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                              service.akamai.status === "healthy"
                                ? "bg-emerald-600 dark:bg-emerald-500"
                                : service.akamai.status === "warning"
                                  ? "bg-amber-600 dark:bg-amber-500"
                                  : "bg-rose-600 dark:bg-rose-500"
                            }`}
                          >
                            {service.code === "IBBR" && <Globe className="h-3.5 w-3.5 text-black" />}
                            {service.code === "MBS" && <Smartphone className="h-3.5 w-3.5 text-black" />}
                            {service.code === "P2P-SG" && <CreditCard className="h-3.5 w-3.5 text-black" />}
                            {service.code === "IWSM" && <BarChart3 className="h-3.5 w-3.5 text-black" />}
                            {service.code === "IDEAL" && <Building2 className="h-3.5 w-3.5 text-black" />}
                            {service.code === "IDEAL-M" && <Tablet className="h-3.5 w-3.5 text-black" />}
                          </div>
                          <span className="text-xs font-medium text-center">{service.name}</span>
                          <span className="text-[9px] text-muted-foreground">{service.code}</span>
                          <div className="flex items-center mt-0.5 space-x-1">
                            <StatusIndicator status={service.akamai.status} size="sm" />
                            {service.akamai.active && (
                              <span className="text-[9px] font-medium bg-emerald-600 text-white px-1 rounded">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cloudflare Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Cloudflare</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {services.map((service) => (
                        <div
                          key={`cloudflare-${service.code}`}
                          className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${
                              service.cloudflare.status === "healthy"
                                ? "bg-emerald-600 dark:bg-emerald-500"
                                : service.cloudflare.status === "warning"
                                  ? "bg-amber-600 dark:bg-amber-500"
                                  : "bg-rose-600 dark:bg-rose-500"
                            }`}
                          >
                            {service.code === "IBBR" && <Globe className="h-3.5 w-3.5 text-black" />}
                            {service.code === "MBS" && <Smartphone className="h-3.5 w-3.5 text-black" />}
                            {service.code === "P2P-SG" && <CreditCard className="h-3.5 w-3.5 text-black" />}
                            {service.code === "IWSM" && <BarChart3 className="h-3.5 w-3.5 text-black" />}
                            {service.code === "IDEAL" && <Building2 className="h-3.5 w-3.5 text-black" />}
                            {service.code === "IDEAL-M" && <Tablet className="h-3.5 w-3.5 text-black" />}
                          </div>
                          <span className="text-xs font-medium text-center">{service.name}</span>
                          <span className="text-[9px] text-muted-foreground">{service.code}</span>
                          <div className="flex items-center mt-0.5 space-x-1">
                            <StatusIndicator status={service.cloudflare.status} size="sm" />
                            {service.cloudflare.active && (
                              <span className="text-[9px] font-medium bg-emerald-600 text-white px-1 rounded">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleFlip("akamai", "cloudflare")}>
                    Flip Akamai to Cloudflare
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleFlip("cloudflare", "akamai")}>
                    Flip Cloudflare to Akamai
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* L3 DDoS Protection */}
            <div className="relative">
              <L3DDoSProtection />
              <div className="hidden md:flex absolute left-[calc(33.33%-2rem)] top-1/2 -translate-y-1/2 items-center justify-center w-16 z-10">
                <ArrowRight className="h-8 w-16 text-primary/50" />
              </div>
            </div>

            {/* DBS Gateway */}
            <div className="relative">
              <DBSGateway />
              <div className="hidden md:flex absolute left-[calc(66.66%-2rem)] top-1/2 -translate-y-1/2 items-center justify-center w-16 z-10">
                <ArrowRight className="h-8 w-16 text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={flipDialog.isOpen}
        onOpenChange={(open) => !open && setFlipDialog((prev) => ({ ...prev, isOpen: false }))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {flipDialog.step === "select" && "Select Services to Flip"}
              {flipDialog.step === "summary" && "Review Selected Services"}
              {flipDialog.step === "confirm" && "Confirm Flip Request"}
            </DialogTitle>
            <DialogDescription>
              {flipDialog.step === "select" &&
                `Select services to flip from ${flipDialog.source} to ${flipDialog.target}`}
              {flipDialog.step === "summary" && "Review the services you've selected for the flip"}
              {flipDialog.step === "confirm" && "Confirm to submit the flip request for approval"}
            </DialogDescription>
          </DialogHeader>

          {flipDialog.step === "select" && flipDialog.source && (
            <div className="space-y-4">
              {services
                .filter((service) => service[flipDialog.source!]?.active)
                .map((service) => (
                  <div key={service.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.code}
                      checked={flipDialog.selectedServices.includes(service.code)}
                      onCheckedChange={() => handleServiceSelect(service.code)}
                    />
                    <label
                      htmlFor={service.code}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name} ({service.code})
                    </label>
                  </div>
                ))}
            </div>
          )}

          {flipDialog.step === "summary" && flipDialog.source && (
            <div className="space-y-4">
              {flipDialog.selectedServices.map((code) => {
                const service = services.find((s) => s.code === code)
                return service ? (
                  <div key={code} className="flex items-center justify-between">
                    <span>
                      {service.name} ({service.code})
                    </span>
                    <div className="flex items-center space-x-2">
                      <StatusIndicator status={service[flipDialog.source!]?.status || "unknown"} size="sm" />
                      <ArrowRight className="h-4 w-4" />
                      <StatusIndicator status="unknown" size="sm" />
                    </div>
                  </div>
                ) : null
              })}
            </div>
          )}

          {flipDialog.step === "confirm" && (
            <p className="text-sm text-muted-foreground">
              You are about to submit a request to flip {flipDialog.selectedServices.length} service(s) from{" "}
              {flipDialog.source} to {flipDialog.target}. This action will require approval before being executed.
            </p>
          )}

          <DialogFooter>
            {flipDialog.step !== "select" && (
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            )}
            {flipDialog.step !== "confirm" ? (
              <Button onClick={handleNextStep} disabled={flipDialog.selectedServices.length === 0}>
                {flipDialog.step === "select" ? "Review Selection" : "Confirm"}
              </Button>
            ) : (
              <Button onClick={submitFlipRequest}>Submit for Approval</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

