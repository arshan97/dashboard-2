"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { L3DDoSProtection } from "@/components/l3-ddos-protection";
import { DBSGateway } from "@/components/dbs-gateway";
import { ServiceProvidersGrid } from "@/components/service-providers-grid";
import { AvailabilityChart } from "@/components/availability-chart";
import { HealthTimeline } from "@/components/health-timeline";
import type {
  BankingService,
  DDoSProtection,
  CDNService,
  ServiceProvider,
} from "@/types/dashboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const dnsServices: BankingService[] = [
  { name: "Internet Banking", code: "IBBR", status: "healthy" },
  { name: "Mobile Banking", code: "MBS", status: "healthy" },
  { name: "PayLah", code: "P2P-SG", status: "healthy" },
  { name: "iWealth", code: "IWSM", status: "healthy" },
  { name: "IDEAL", code: "IDEAL", status: "healthy" },
  { name: "IDEAL Mobile", code: "IDEAL-M", status: "healthy" },
];

const ddosProtection: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "healthy" },
  { name: "Nexus Guard", enabled: true, status: "critical" },
];

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
];

const providers: ServiceProvider[] = [
  {
    name: "StarHub",
    services: [
      { name: "Internet", status: "healthy" },
      { name: "Mobile", status: "healthy" },
      { name: "TV", status: "healthy" },
    ],
  },
  {
    name: "Singtel",
    services: [
      { name: "Internet", status: "healthy" },
      { name: "Mobile", status: "healthy" },
      { name: "TV", status: "healthy" },
    ],
  },
  {
    name: "M1",
    services: [
      { name: "Internet", status: "healthy" },
      { name: "Mobile", status: "healthy" },
    ],
  },
];

type FlipDialogState = {
  isOpen: boolean;
  source: "akamai" | "cloudflare" | null;
  target: "akamai" | "cloudflare" | null;
  selectedServices: string[];
};

export default function DashboardPage() {
  const [services, setServices] = useState(cdnServices);
  const [flipDialog, setFlipDialog] = useState<FlipDialogState>({
    isOpen: false,
    source: null,
    target: null,
    selectedServices: [],
  });
  const [chartDialog, setChartDialog] = useState<{
    isOpen: boolean;
    service: CDNService | null;
    provider: "akamai" | "cloudflare" | null;
  }>({
    isOpen: false,
    service: null,
    provider: null,
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const [dnsServicesHealth, setDnsServicesHealth] = useState(dnsServices);
  const [ddosProtectionHealth, setDdosProtectionHealth] =
    useState(ddosProtection);
  const [cdnServicesHealth, setCdnServicesHealth] = useState(services);
  const [serviceProvidersHealth, setServiceProvidersHealth] =
    useState(providers);

  const handleFlip = (
    source: "akamai" | "cloudflare",
    target: "akamai" | "cloudflare"
  ) => {
    setFlipDialog({
      isOpen: true,
      source,
      target,
      selectedServices: [], // Changed from pre-selecting services to an empty array
    });
  };

  const handleServiceSelect = (code: string) => {
    setFlipDialog((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(code)
        ? prev.selectedServices.filter((c) => c !== code)
        : [...prev.selectedServices, code],
    }));
  };

  const submitFlipRequest = () => {
    console.log("Submitting flip request:", flipDialog);

    toast({
      title: "Flip Request Submitted",
      description: `Request to flip ${flipDialog.selectedServices.length} services from ${flipDialog.source} to ${flipDialog.target} has been submitted for approval.`,
    });

    setFlipDialog({
      isOpen: false,
      source: null,
      target: null,
      selectedServices: [],
    });
  };

  const handleOpenChart = (
    service: CDNService,
    provider: "akamai" | "cloudflare"
  ) => {
    setChartDialog({ isOpen: true, service, provider });
  };

  const handleTimeSelect = (
    time: string,
    status: "healthy" | "warning" | "critical"
  ) => {
    setSelectedTime(time);

    // Generate random health statuses based on the selected time's overall status
    const generateRandomStatus = (
      baseStatus: "healthy" | "warning" | "critical"
    ) => {
      const statuses: ("healthy" | "warning" | "critical")[] = [
        "healthy",
        "warning",
        "critical",
      ];
      const randomIndex = Math.floor(Math.random() * 3);
      return baseStatus === "healthy"
        ? randomIndex === 0
          ? "warning"
          : "healthy"
        : baseStatus === "warning"
        ? statuses[randomIndex]
        : randomIndex === 0
        ? "warning"
        : "critical";
    };

    // Update DNS services health
    setDnsServicesHealth(
      dnsServices.map((service) => ({
        ...service,
        status: generateRandomStatus(status),
      }))
    );

    // Update DDoS protection health
    setDdosProtectionHealth(
      ddosProtection.map((protection) => ({
        ...protection,
        status: generateRandomStatus(status),
      }))
    );

    // Update CDN services health
    setCdnServicesHealth(
      services.map((service) => ({
        ...service,
        akamai: { ...service.akamai, status: generateRandomStatus(status) },
        cloudflare: {
          ...service.cloudflare,
          status: generateRandomStatus(status),
        },
      }))
    );

    // Update service providers health
    setServiceProvidersHealth(
      providers.map((provider) => ({
        ...provider,
        services: provider.services.map((service) => ({
          ...service,
          status: generateRandomStatus(status),
        })),
      }))
    );

    toast({
      title: "Time Selected",
      description: `Showing overview for ${time}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-2 overflow-x-auto min-w-full h-full">
      <div className="mb-6">
        <HealthTimeline onTimeSelect={handleTimeSelect} />
      </div>
      <div className="flex space-x-6 h-full">
        {/* Service Providers Grid */}
        <div className="w-1/3 h-full">
          <ServiceProvidersGrid providers={serviceProvidersHealth} />
        </div>

        {/* Right side components */}
        <div className="w-2/3 space-y-6 flex flex-col">
          {/* DNS Records and DNS Provider */}
          <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-2">
              <CardTitle className="text-base font-medium">
                DNS Management
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <Shield className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-2 py-2">
              <div className="grid md:grid-cols-2 gap-4">
                {/* DNS Records */}
                <div>
                  <h3 className="text-sm font-medium mb-2">DNS Records</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {dnsServicesHealth.map((service) => (
                      <div
                        key={service.code}
                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusColor(
                            service.status
                          )}`}
                        >
                          {service.code === "IBBR" && (
                            <Globe className="h-4 w-4 text-black" />
                          )}
                          {service.code === "MBS" && (
                            <Smartphone className="h-4 w-4 text-black" />
                          )}
                          {service.code === "P2P-SG" && (
                            <CreditCard className="h-4 w-4 text-black" />
                          )}
                          {service.code === "IWSM" && (
                            <BarChart3 className="h-4 w-4 text-black" />
                          )}
                          {service.code === "IDEAL" && (
                            <Building2 className="h-4 w-4 text-black" />
                          )}
                          {service.code === "IDEAL-M" && (
                            <Tablet className="h-4 w-4 text-black" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-center">
                          {service.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {service.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DNS Provider */}
                <div>
                  <h3 className="text-sm font-medium mb-2">DNS Provider</h3>
                  <div className="space-y-2">
                    {ddosProtectionHealth.map((protection) => (
                      <div
                        key={protection.name}
                        className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                              protection.status
                            )}`}
                          >
                            {protection.name === "StarHub" && (
                              <Star className="h-4 w-4 text-black" />
                            )}
                            {protection.name === "Akamai" && (
                              <Zap className="h-4 w-4 text-black" />
                            )}
                            {protection.name === "Nexus Guard" && (
                              <ShieldIcon className="h-4 w-4 text-black" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {protection.name}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            (window.location.href = `mailto:support@${protection.name
                              .toLowerCase()
                              .replace(" ", "")}.com`)
                          }
                          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                          aria-label={`Send email to ${protection.name} support`}
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CDN Management, L3 DDoS, and DBS Gateway */}
          <div className="grid gap-6 md:grid-cols-3 relative flex-grow">
            {/* CDN Management */}
            <Card className="glassmorphic">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  CDN Management
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-2">
                <div className="grid gap-4">
                  {/* Akamai Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Akamai</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFlip("akamai", "cloudflare")}
                      >
                        Flip to Cloudflare
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cdnServicesHealth.map((service) => (
                        <div
                          key={`akamai-${service.code}`}
                          className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                          onClick={() => handleOpenChart(service, "akamai")}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${getStatusColor(
                              service.akamai.status
                            )}`}
                          >
                            {service.code === "IBBR" && (
                              <Globe className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "MBS" && (
                              <Smartphone className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "P2P-SG" && (
                              <CreditCard className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "IWSM" && (
                              <BarChart3 className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "IDEAL" && (
                              <Building2 className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "IDEAL-M" && (
                              <Tablet className="h-3.5 w-3.5 text-black" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-center">
                            {service.name}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {service.code}
                          </span>
                          <div className="flex items-center mt-0.5 space-x-1">
                            {service.akamai.active && (
                              <span className="text-[9px] font-medium bg-blue-600 text-white px-1 rounded">
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
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Cloudflare</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFlip("cloudflare", "akamai")}
                      >
                        Flip to Akamai
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cdnServicesHealth.map((service) => (
                        <div
                          key={`cloudflare-${service.code}`}
                          className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                          onClick={() => handleOpenChart(service, "cloudflare")}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${getStatusColor(
                              service.cloudflare.status
                            )}`}
                          >
                            {service.code === "IBBR" && (
                              <Globe className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "MBS" && (
                              <Smartphone className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "P2P-SG" && (
                              <CreditCard className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "IWSM" && (
                              <BarChart3 className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "IDEAL" && (
                              <Building2 className="h-3.5 w-3.5 text-black" />
                            )}
                            {service.code === "IDEAL-M" && (
                              <Tablet className="h-3.5 w-3.5 text-black" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-center">
                            {service.name}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            {service.code}
                          </span>
                          <div className="flex items-center mt-0.5 space-x-1">
                            {service.cloudflare.active && (
                              <span className="text-[9px] font-medium bg-blue-600 text-white px-1 rounded">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* L3 DDoS Protection */}
            <div className="relative">
              <L3DDoSProtection />
              <div className="hidden md:flex absolute left-[calc(33.33%-1rem)] top-1/2 -translate-y-1/2 items-center justify-center w-8 z-10">
                <ArrowRight className="h-8 w-8 text-primary/30" />
              </div>
            </div>

            {/* DBS Gateway */}
            <div className="relative">
              <DBSGateway />
              <div className="hidden md:flex absolute left-[calc(66.66%-1rem)] top-1/2 -translate-y-1/2 items-center justify-center w-8 z-10">
                <ArrowRight className="h-8 w-8 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={flipDialog.isOpen}
        onOpenChange={(open) =>
          !open && setFlipDialog((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>CDN Flip</DialogTitle>
            <DialogDescription>
              Select services to flip from{" "}
              {flipDialog.source?.charAt(0).toUpperCase() +
                flipDialog.source?.slice(1)}{" "}
              to{" "}
              {flipDialog.target?.charAt(0).toUpperCase() +
                flipDialog.target?.slice(1)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr] items-center text-sm font-medium bg-muted p-2 rounded">
              <span>Service</span>
              <span className="text-center">
                {flipDialog.source?.charAt(0).toUpperCase() +
                  flipDialog.source?.slice(1)}
              </span>
              <span className="text-center">Flip</span>
              <span className="text-center">
                {flipDialog.target?.charAt(0).toUpperCase() +
                  flipDialog.target?.slice(1)}
              </span>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {services
                .filter((service) => service[flipDialog.source!]?.active)
                .map((service) => {
                  const isTargetCritical =
                    service[flipDialog.target!]?.status === "critical";
                  return (
                    <div
                      key={service.code}
                      className={`grid grid-cols-[2fr,1fr,1fr,1fr] items-center gap-2 p-2 rounded ${
                        isTargetCritical ? "bg-muted/50" : "hover:bg-muted/30"
                      } transition-colors`}
                    >
                      <div className="flex items-center space-x-2">
                        {!isTargetCritical && (
                          <Checkbox
                            id={service.code}
                            checked={flipDialog.selectedServices.includes(
                              service.code
                            )}
                            onCheckedChange={() =>
                              handleServiceSelect(service.code)
                            }
                          />
                        )}
                        <label
                          htmlFor={service.code}
                          className={`text-sm font-medium leading-none ${
                            isTargetCritical ? "opacity-50" : ""
                          }`}
                        >
                          {service.name} ({service.code})
                        </label>
                      </div>
                      <div className="flex justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(
                                  service[flipDialog.source!].status
                                )}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{service[flipDialog.source!].status}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex justify-center">
                        {!isTargetCritical &&
                          flipDialog.selectedServices.includes(
                            service.code
                          ) && <ArrowRight className="h-4 w-4" />}
                      </div>
                      <div className="flex justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(
                                  service[flipDialog.target!].status
                                )}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{service[flipDialog.target!].status}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Critical</span>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Selected:</span>
              <span className="text-sm">
                {flipDialog.selectedServices.length}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  setFlipDialog((prev) => ({ ...prev, isOpen: false }))
                }
              >
                Cancel
              </Button>
              <Button
                onClick={submitFlipRequest}
                disabled={flipDialog.selectedServices.length === 0}
              >
                Submit Flip Request
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {chartDialog.service && chartDialog.provider && (
        <AvailabilityChart
          service={chartDialog.service}
          provider={chartDialog.provider}
          isOpen={chartDialog.isOpen}
          onOpenChange={(open) =>
            setChartDialog((prev) => ({ ...prev, isOpen: open }))
          }
        />
      )}
    </div>
  );
}
