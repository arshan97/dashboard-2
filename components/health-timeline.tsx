"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type TimelineItem = {
  time: string;
  status: "healthy" | "warning" | "critical";
  isCurrent: boolean;
};

const generateMockTimelineData = (): TimelineItem[] => {
  const statuses: ("healthy" | "warning" | "critical")[] = [
    "healthy",
    "warning",
    "critical",
  ];
  const timeline: TimelineItem[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      currentDate.getTime() - (22 - i) * 2 * 60 * 60 * 1000
    );
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isCurrent = i === 11;
    timeline.push({ time, status, isCurrent });
  }

  return timeline;
};

type HealthTimelineProps = {
  onTimeSelect: (
    time: string,
    status: "healthy" | "warning" | "critical"
  ) => void;
};

export function HealthTimeline({ onTimeSelect }: HealthTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setTimeline(generateMockTimelineData());
    const now = new Date();
    setCurrentTime(
      now.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  }, []);

  const handleTimeClick = (item: TimelineItem) => {
    setSelectedTime(item.time);
    onTimeSelect(item.time, item.status);
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Health Timeline (Last 24 Hours)</span>
          <div className="flex items-center text-sm font-normal">
            <Clock className="w-4 h-4 mr-1" />
            Current Time: {currentTime}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between space-x-1">
          {timeline.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                className={cn(
                  "w-12 h-12 rounded-full mb-1 border-2 transition-all flex items-center justify-center",
                  item.status === "healthy" &&
                    "bg-green-500 hover:bg-green-600",
                  item.status === "warning" &&
                    "bg-yellow-500 hover:bg-yellow-600",
                  item.status === "critical" && "bg-red-500 hover:bg-red-600",
                  item.isCurrent && "ring-2 ring-blue-500",
                  selectedTime === item.time && "border-white",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                onClick={() => handleTimeClick(item)}
                aria-label={`Health status at ${item.time}: ${item.status}`}
              >
                {item.status === "healthy" && (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
                {item.status === "warning" && (
                  <AlertTriangle className="w-6 h-6 text-white" />
                )}
                {item.status === "critical" && (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </button>
              <span className="text-xs font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
