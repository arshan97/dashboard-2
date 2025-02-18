"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CDNService } from "@/types/dashboard";

const generateServiceData = (
  service: CDNService,
  provider: "akamai" | "cloudflare"
) => {
  const data = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  // For IDEAL in Cloudflare, show more 0% availability
  const isIdealCloudflare =
    service.code === "IDEAL" && provider === "cloudflare";

  for (let i = 23; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      availability: isIdealCloudflare
        ? Math.random() < 0.7
          ? 0
          : 100
        : Math.random() < 0.1
        ? 0
        : 100,
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const availability = payload[0].value;
      const status = availability === 100 ? "Available" : "Unavailable";
      return (
        <div className="bg-background/90 border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            Status: <span className="font-medium">{status}</span>
          </p>
          <p className="text-sm">
            Availability: <span className="font-medium">{availability}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, value } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="white"
        stroke={value === 100 ? "#22c55e" : "#ef4444"}
        strokeWidth={2}
      />
    );
  };

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
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                interval={0}
                tick={{ fontSize: 10 }}
                tickMargin={10}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickCount={2}
                ticks={[0, 100]}
                label={{
                  value: "Availability (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="stepAfter"
                dataKey="availability"
                stroke="white"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={(props) => (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    fill={
                      props.payload.availability === 100 ? "#22c55e" : "#ef4444"
                    }
                    stroke="white"
                    strokeWidth={2}
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm">100% Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm">0% Available</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
