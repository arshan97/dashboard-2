import { useState } from "react";
import { StatusIndicator } from "./status-indicator";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type GatewayStatusesType = {
  DCE: { [key: string]: string };
  DCW: { [key: string]: string };
};

type DBSGatewayProps = {
  gatewayStatuses: GatewayStatusesType;
  compact?: boolean;
  onStatusChange: (
    location: string,
    provider: string,
    newStatus: string
  ) => void;
};

export function DBSGateway({
  gatewayStatuses,
  compact = false,
  onStatusChange,
}: DBSGatewayProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    location: string;
    provider: string;
    newStatus: boolean;
  }>({
    isOpen: false,
    location: "",
    provider: "",
    newStatus: false,
  });

  const handleToggle = (
    location: string,
    provider: string,
    newStatus: boolean
  ) => {
    setConfirmDialog({
      isOpen: true,
      location,
      provider,
      newStatus,
    });
  };

  const handleConfirm = () => {
    onStatusChange(
      confirmDialog.location,
      confirmDialog.provider,
      confirmDialog.newStatus ? "healthy" : "critical"
    );
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-2">
      {Object.entries(gatewayStatuses).map(([location, providers]) => (
        <div key={location} className="space-y-1">
          <h3 className="text-xs font-medium">{location}</h3>
          <div className="flex flex-col space-y-1">
            {Object.entries(providers).map(([provider, status]) => (
              <div
                key={`${location}-${provider}`}
                className="flex items-center justify-between p-1.5 rounded-md bg-muted/30 h-7"
              >
                <span className="text-xs">{provider}</span>
                <div className="flex items-center space-x-2">
                  <StatusIndicator status={status as any} size="xs" />
                  <Switch
                    checked={status === "healthy"}
                    onCheckedChange={(checked) =>
                      handleToggle(location, provider, checked)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of{" "}
              {confirmDialog.provider} in {confirmDialog.location} to{" "}
              {confirmDialog.newStatus ? "healthy" : "unhealthy"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
