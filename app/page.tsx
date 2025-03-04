"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Check, Shield, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DBSGateway } from "@/components/dbs-gateway";
import { ServiceProvidersGrid } from "@/components/service-providers-grid";
import { AvailabilityChart } from "@/components/availability-chart";
import { HealthTimeline } from "@/components/health-timeline";
import type {
  BankingService,
  DDoSProtection,
  ServiceProvider,
} from "@/types/dashboard";
import { StatusIndicator } from "@/components/status-indicator";
import { ApplicationCodes } from "@/components/application-codes";
import { DNSRecords } from "@/components/dns-records";
import { CDNStatus } from "@/components/cdn-status";
import { CleanPipeStatus } from "@/components/clean-pipe-status";

type CDNStatus = {
  status: "healthy" | "warning" | "critical";
  active: boolean;
};

type CDNService = {
  name: string;
  code: string;
  akamai: CDNStatus;
  cloudflare: CDNStatus;
};

const initialCdnServices: CDNService[] = [
  {
    name: "PayLah",
    code: "PSP-SG",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "Internet Banking",
    code: "IBBR",
    akamai: { status: "critical", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "Mobile Banking",
    code: "MBS",
    akamai: { status: "warning", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "IDEAL",
    code: "IDEAL",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "IDEAL Mobile",
    code: "IDEAL-M",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "critical", active: true },
  },
  {
    name: "iWealth",
    code: "WISM",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "warning", active: false },
  },
  {
    name: "Corporate Mobile",
    code: "CMCP",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "CSSP",
    code: "CSSP",
    akamai: { status: "warning", active: false },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "DQSP",
    code: "DQSP",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "GCSP",
    code: "GCSP",
    akamai: { status: "healthy", active: true },
    cloudflare: { status: "healthy", active: false },
  },
  {
    name: "IPE4",
    code: "IPE4",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "warning", active: true },
  },
  {
    name: "P2PC",
    code: "P2PC",
    akamai: { status: "critical", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "TIGS",
    code: "TIGS",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "FDPS",
    code: "FDPS",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "CBDPSTDINSG",
    code: "CBDPSTDINSG",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "CASP",
    code: "CASP",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "CBTXN-SG",
    code: "CBTXN-SG",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "healthy", active: true },
  },
  {
    name: "VOMO",
    code: "VOMO",
    akamai: { status: "healthy", active: false },
    cloudflare: { status: "critical", active: false },
  },
  {
    name: "VCSP",
    code: "VCSP",
    akamai: { status: "warning", active: false },
    cloudflare: { status: "healthy", active: true },
  },
];

const initialDnsServices: BankingService[] = initialCdnServices.map(
  (service) => ({
    name: service.name,
    code: service.code,
    status: "healthy",
  })
);

const initialDdosProtection: DDoSProtection[] = [
  { name: "StarHub", enabled: true, status: "healthy" },
  { name: "Akamai", enabled: true, status: "healthy" },
  { name: "Nexus Guard", enabled: true, status: "healthy" },
];

const initialProviders: ServiceProvider[] = [
  {
    name: "StarHub",
    services: initialCdnServices.map((service) => ({
      name: service.code,
      code: service.code,
      status: "healthy",
    })),
  },
  {
    name: "Singtel",
    services: initialCdnServices.map((service) => ({
      name: service.code,
      code: service.code,
      status: "healthy",
    })),
  },
  {
    name: "M1",
    services: initialCdnServices.map((service) => ({
      name: service.code,
      code: service.code,
      status: "healthy",
    })),
  },
];

const initialState = {
  dnsServices: initialDnsServices,
  ddosProtection: initialDdosProtection,
  cdnServices: initialCdnServices,
  serviceProviders: initialProviders,
  l3DDoSStatuses: {
    akamai: {
      DCE: Array(initialCdnServices.length).fill({ status: "healthy" }),
      DCW: Array(initialCdnServices.length).fill({ status: "healthy" }),
    },
    cloudflare: {
      DCE: Array(initialCdnServices.length).fill({ status: "healthy" }),
      DCW: Array(initialCdnServices.length).fill({ status: "healthy" }),
    },
  },
  gatewayStatuses: {
    DCE: { Singtel: "healthy", Starhub: "healthy" },
    DCW: { Singtel: "healthy", Starhub: "healthy" },
  },
  cleanPipeStatuses: {
    akamai: Object.fromEntries(
      initialCdnServices.map((service) => [
        service.code,
        { status: service.akamai.status, active: service.akamai.active },
      ])
    ),
    cloudflare: Object.fromEntries(
      initialCdnServices.map((service) => [
        service.code,
        {
          status: service.cloudflare.status,
          active: service.cloudflare.active,
        },
      ])
    ),
  },
};

type FlipDialogState = {
  isOpen: boolean;
  source: "akamai" | "cloudflare" | null;
  target: "akamai" | "cloudflare" | null;
  selectedServices: string[];
};

export default function DashboardPage() {
  const [cdnServices, setCdnServices] = useState(initialState.cdnServices);
  const [cleanPipeStatuses, setCleanPipeStatuses] = useState(
    initialState.cleanPipeStatuses
  );
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

  const [dnsServicesHealth, setDnsServicesHealth] = useState(
    initialState.dnsServices
  );
  const [ddosProtectionHealth, setDdosProtectionHealth] = useState(
    initialState.ddosProtection
  );
  const [serviceProvidersHealth, setServiceProvidersHealth] = useState(
    initialState.serviceProviders
  );

  const [l3DDoSStatuses, setL3DDoSStatuses] = useState(
    initialState.l3DDoSStatuses
  );

  const [gatewayStatuses, setGatewayStatuses] = useState(
    initialState.gatewayStatuses
  );

  useEffect(() => {
    // Set initial state for "Now" time
    setDnsServicesHealth(initialState.dnsServices);
    setDdosProtectionHealth(initialState.ddosProtection);
    setCdnServices(initialState.cdnServices);
    setServiceProvidersHealth(initialState.serviceProviders);
    setL3DDoSStatuses(initialState.l3DDoSStatuses);
    setGatewayStatuses(initialState.gatewayStatuses);
    setCleanPipeStatuses(initialState.cleanPipeStatuses);
    setSelectedTime("Now");
  }, []);

  const handleFlip = (
    source: "akamai" | "cloudflare",
    target: "akamai" | "cloudflare"
  ) => {
    setFlipDialog({
      isOpen: true,
      source,
      target,
      selectedServices: [],
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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);

    if (time === "Now") {
      // Use the initial state for "Now"
      setCdnServices(() => initialState.cdnServices);
      setCleanPipeStatuses(() => initialState.cleanPipeStatuses);
      setDnsServicesHealth(() => initialState.dnsServices);
      setDdosProtectionHealth(() => initialState.ddosProtection);
      setServiceProvidersHealth(() => initialState.serviceProviders);
      setL3DDoSStatuses(() => initialState.l3DDoSStatuses);
      setGatewayStatuses(() => initialState.gatewayStatuses);
    } else {
      // For previous time selections, set all services to healthy (green) and inactive
      setCdnServices(() =>
        initialCdnServices.map((service) => ({
          ...service,
          akamai: { status: "healthy", active: false },
          cloudflare: { status: "healthy", active: false },
        }))
      );
      setCleanPipeStatuses({
        akamai: Object.fromEntries(
          initialCdnServices.map((service) => [
            service.code,
            { status: "healthy", active: false },
          ])
        ),
        cloudflare: Object.fromEntries(
          initialCdnServices.map((service) => [
            service.code,
            { status: "healthy", active: false },
          ])
        ),
      });
      setDnsServicesHealth(() =>
        initialDnsServices.map((service) => ({ ...service, status: "healthy" }))
      );
      setDdosProtectionHealth(() =>
        initialDdosProtection.map((protection) => ({
          ...protection,
          status: "healthy",
        }))
      );
      setServiceProvidersHealth(() =>
        initialProviders.map((provider) => ({
          ...provider,
          services: provider.services.map((service) => ({
            ...service,
            status: "healthy",
          })),
        }))
      );
      setL3DDoSStatuses(() => ({
        akamai: {
          DCE: Array(initialCdnServices.length).fill({ status: "healthy" }),
          DCW: Array(initialCdnServices.length).fill({ status: "healthy" }),
        },
        cloudflare: {
          DCE: Array(initialCdnServices.length).fill({ status: "healthy" }),
          DCW: Array(initialCdnServices.length).fill({ status: "healthy" }),
        },
      }));
      setGatewayStatuses(() => ({
        DCE: { Singtel: "healthy", Starhub: "healthy" },
        DCW: { Singtel: "healthy", Starhub: "healthy" },
      }));
    }

    toast({
      title: "Time Selected",
      description: `Showing overview for ${time}`,
    });
  };

  const getOuterStatusColor = (
    status: CDNStatus | { status: string; active: boolean } | undefined
  ) => {
    if (!status) return "bg-gray-500";
    if (status.status === "critical") return "bg-red-500";
    if (status.status === "warning") return "bg-yellow-500";
    if (status.status === "healthy") return "bg-green-500";
    return "bg-gray-500";
  };

  const getInnerStatusColor = (
    status: CDNStatus | { status: string; active: boolean } | undefined
  ) => {
    return status?.active ? "bg-white" : "bg-gray-400";
  };

  const handleGatewayStatusChange = (
    location: string,
    provider: string,
    newStatus: string
  ) => {
    setGatewayStatuses((prev) => ({
      ...prev,
      [location]: {
        ...prev[location as keyof typeof prev],
        [provider]: newStatus,
      },
    }));
  };

  return (
    <div className="w-full space-y-4">
      <HealthTimeline onTimeSelect={handleTimeSelect} />

      {/* DNS Provider Section - Centered above grid */}
      <div className="flex justify-center mb-4">
        <Card className="w-1/3 border-l-4 border-l-primary/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              DNS Provider
              <Shield className="ml-auto h-4 w-4 text-primary/70" />
              <span className="ml-1.5 text-xs bg-primary/10 text-primary/70 px-2 py-0.5 rounded-full">
                Partial Control
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex flex-col gap-1">
              {ddosProtectionHealth.map((protection) => (
                <div
                  key={protection.name}
                  className="flex items-center justify-between p-1.5 rounded-md bg-muted/30 h-7"
                >
                  <span className="text-xs font-medium">{protection.name}</span>
                  <div className="flex items-center space-x-2">
                    <StatusIndicator status={protection.status} size="xs" />
                    <button
                      onClick={() =>
                        (window.location.href = `mailto:support@${protection.name
                          .toLowerCase()
                          .replace(" ", "")}.com`)
                      }
                      className="p-1 rounded-full hover:bg-primary/10 transition-colors"
                      aria-label={`Send email to ${protection.name} support`}
                    >
                      <Mail className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-6 gap-2">
        <ApplicationCodes codes={cdnServices} />
        <ServiceProvidersGrid
          providers={serviceProvidersHealth}
          services={cdnServices}
        />
        <DNSRecords dnsServices={dnsServicesHealth} services={cdnServices} />
        <CDNStatus cdnServices={cdnServices} onFlip={handleFlip} />
        <CleanPipeStatus
          cleanPipeStatuses={cleanPipeStatuses}
          services={cdnServices}
        />
        <Card className="h-full bg-secondary/5 border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              DBS Gateway
              <Shield className="ml-auto h-4 w-4 text-primary" />
              <span className="ml-1.5 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                DBS Control
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <DBSGateway
              gatewayStatuses={gatewayStatuses}
              compact={true}
              onStatusChange={handleGatewayStatusChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
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
              {cdnServices
                .filter(
                  (service) =>
                    service[flipDialog.source!]?.active &&
                    (service[flipDialog.source!]?.status === "healthy" ||
                      service[flipDialog.source!]?.status === "warning" ||
                      service[flipDialog.source!]?.status === "critical")
                )
                .map((service) => {
                  const isTargetCritical =
                    service[flipDialog.target!].status === "critical";
                  const isDisabled = isTargetCritical;
                  return (
                    <div
                      key={service.code}
                      className={`grid grid-cols-[2fr,1fr,1fr,1fr] items-center gap-2 p-2 rounded ${
                        isDisabled ? "bg-muted/50" : "hover:bg-muted/30"
                      } transition-colors`}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={service.code}
                          checked={flipDialog.selectedServices.includes(
                            service.code
                          )}
                          onCheckedChange={() =>
                            handleServiceSelect(service.code)
                          }
                          disabled={isDisabled}
                        />
                        <label
                          htmlFor={service.code}
                          className={`text-sm font-medium leading-none ${
                            isDisabled ? "opacity-50" : ""
                          }`}
                        >
                          {service.name} ({service.code})
                        </label>
                      </div>
                      <div className="flex justify-center">
                        <div
                          className={`w-5 h-5 rounded-full ${getOuterStatusColor(
                            service[flipDialog.source!]
                          )} flex items-center justify-center`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${getInnerStatusColor(
                              service[flipDialog.source!]
                            )} flex items-center justify-center`}
                          >
                            {service[flipDialog.source!]?.active && (
                              <Check className="w-2 h-2 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        {!isDisabled &&
                          flipDialog.selectedServices.includes(
                            service.code
                          ) && <ArrowRight className="h-4 w-4" />}
                      </div>
                      <div className="flex justify-center">
                        <div
                          className={`w-5 h-5 rounded-full ${getOuterStatusColor(
                            service[flipDialog.target!]
                          )} flex items-center justify-center`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${getInnerStatusColor(
                              service[flipDialog.target!]
                            )} flex items-center justify-center`}
                          >
                            {service[flipDialog.target!]?.active && (
                              <Check className="w-2 h-2 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-blue-500" />
                </div>
              </div>
              <span className="text-xs">Active Healthy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-blue-500" />
                </div>
              </div>
              <span className="text-xs">Active Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-blue-500" />
                </div>
              </div>
              <span className="text-xs">Active Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-transparent" />
              </div>
              <span className="text-xs">Inactive Healthy</span>
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
