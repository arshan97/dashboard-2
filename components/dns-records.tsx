import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status-indicator";
import type { BankingService, CDNService } from "@/types/dashboard";
import { Shield } from "lucide-react";

type DNSRecordsProps = {
  dnsServices: BankingService[];
  services: CDNService[];
};

export function DNSRecords({ dnsServices, services }: DNSRecordsProps) {
  return (
    <Card className="h-full border-l-4 border-l-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          DNS Records
          <Shield className="ml-auto h-4 w-4 text-orange-500" />
          <span className="ml-1.5 text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full">
            External
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-1 -mt-1.5">
          {services.map((service) => (
            <div
              key={service.code}
              className="flex items-center justify-center h-7 rounded bg-muted/30 -mt-0.5"
            >
              <StatusIndicator
                status={
                  dnsServices.find((s) => s.code === service.code)?.status ||
                  "unknown"
                }
                size="xs"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
