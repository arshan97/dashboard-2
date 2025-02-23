"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status-indicator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Network, Wifi } from "lucide-react";
import type { GatewayLocation } from "@/types/dashboard";

const initialLocations: GatewayLocation[] = [
  {
    name: "DCE",
    providers: [
      { name: "Singtel", status: "critical", enabled: false },
      { name: "Starhub", status: "healthy", enabled: true },
    ],
  },
  {
    name: "DCW",
    providers: [
      { name: "Singtel", status: "critical", enabled: false },
      { name: "Starhub", status: "healthy", enabled: true },
    ],
  },
];

type ToggleDialogState = {
  isOpen: boolean;
  location: string;
  provider: string;
  newState: boolean;
} | null;

type DBSGatewayProps = {
  gatewayStatuses: {
    DCE: { Singtel: string; Starhub: string };
    DCW: { Singtel: string; Starhub: string };
  };
};

export function DBSGateway({ gatewayStatuses }: DBSGatewayProps) {
  const [toggleDialog, setToggleDialog] = useState<ToggleDialogState>(null);
  const { toast } = useToast();

  const handleToggle = (
    locationName: string,
    providerName: string,
    newState: boolean
  ) => {
    setToggleDialog({
      isOpen: true,
      location: locationName,
      provider: providerName,
      newState,
    });
  };

  const submitToggleRequest = () => {
    if (!toggleDialog) return;

    toast({
      title: "Gateway Status Change Requested",
      description: `Request to ${
        toggleDialog.newState ? "enable" : "disable"
      } ${toggleDialog.provider} in ${
        toggleDialog.location
      } has been submitted for approval.`,
    });

    setToggleDialog(null);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          DBS Gateway
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-2 space-y-4">
        {Object.entries(gatewayStatuses).map(([location, providers], index) => (
          <div key={location}>
            {index > 0 && (
              <div className="border-t border-border/50 my-2"></div>
            )}
            <h3 className="text-sm font-medium mb-2">{location}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(providers).map(([provider, status]) => (
                <div
                  key={`${location}-${provider}`}
                  className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      status === "healthy"
                        ? "bg-emerald-600 dark:bg-emerald-500"
                        : "bg-rose-600 dark:bg-rose-500"
                    }`}
                  >
                    {provider === "Singtel" ? (
                      <Network className="h-4 w-4 text-black" />
                    ) : (
                      <Wifi className="h-4 w-4 text-black" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-center">
                    {provider}
                  </span>
                  <StatusIndicator
                    status={status}
                    size="sm"
                    className="mt-1 mb-1"
                  />
                  <Switch
                    checked={status !== "critical"}
                    onCheckedChange={(checked) =>
                      handleToggle(location, provider, checked)
                    }
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog
        open={toggleDialog?.isOpen}
        onOpenChange={(open) => !open && setToggleDialog(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Gateway Change Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to request to{" "}
              {toggleDialog?.newState ? "enable" : "disable"}{" "}
              {toggleDialog?.provider} in {toggleDialog?.location}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleDialog(null)}>
              Cancel
            </Button>
            <Button onClick={submitToggleRequest}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
