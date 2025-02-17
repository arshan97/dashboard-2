"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CDNService } from "@/types/dashboard";

// Generate data based on service status
const generateServiceData = (
  service: CDNService,
  provider: "akamai" | "cloudflare"
) => {
  const data = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  // For IDEAL in Cloudflare, show critical status (0% availability)
  const isIdealCloudflare =
    service.code === "IDEAL" && provider === "cloudflare";

  for (let i = 12; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 2 * 60 * 60 * 1000);
    data.push({
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      availability: isIdealCloudflare ? 0 : 100,
      status: isIdealCloudflare ? "Unavailable" : "Available",
    });
  }
  return data;
};

interface AvailabilityChartProps {
  service: CDNService;
  provider: "akamai" | "cloudflare";
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AvailabilityChart({
  service,
  provider,
  isOpen,
  onOpenChange,
}: AvailabilityChartProps) {
  const data = generateServiceData(service, provider);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const status = payload[0].payload.status;
      return (
        <div className="bg-background/90 border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.time}</p>
          <p className="text-sm">
            Status: <span className="font-medium">{status}</span>
          </p>
          <p className="text-sm">
            Availability:{" "}
            <span className="font-medium">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Determine the fill color based on service and provider
  const isIdealCloudflare =
    service.code === "IDEAL" && provider === "cloudflare";
  const areaColor = isIdealCloudflare ? "#ef4444" : "#22c55e";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle>
            {service.name} ({service.code}) -{" "}
            {provider.charAt(0).toUpperCase() + provider.slice(1)} Availability
            Trend
          </DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" interval={1} tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickCount={6}
                label={{
                  value: "Percentage",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="stepAfter"
                dataKey="availability"
                stroke={areaColor}
                fill={areaColor}
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span className="text-sm">Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-sm" />
            <span className="text-sm">Maintenance</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
