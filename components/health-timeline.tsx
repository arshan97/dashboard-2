"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TimelineItem = {
  time: string;
  isCurrent: boolean;
};

const generateTimelineData = (): TimelineItem[] => {
  const timeline: TimelineItem[] = [];
  const currentDate = new Date();
  currentDate.setMinutes(
    currentDate.getMinutes() - (currentDate.getMinutes() % 5),
    0,
    0
  ); // Round to nearest 5 minutes

  for (let i = 0; i < 13; i++) {
    const date = new Date(currentDate.getTime() - i * 5 * 60 * 1000);
    const time =
      i === 0
        ? "Now"
        : date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
    const isCurrent = i === 0;
    timeline.unshift({ time, isCurrent }); // Add to the beginning of the array
  }

  return timeline;
};

type HealthTimelineProps = {
  onTimeSelect: (time: string) => void;
};

export function HealthTimeline({ onTimeSelect }: HealthTimelineProps) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    setTimeline(generateTimelineData());
    const now = new Date();
    setCurrentTime(
      now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  }, []);

  const handleTimeClick = (item: TimelineItem) => {
    setSelectedTime(item.time);
    onTimeSelect(item.time);
  };

  return (
    <Card className="bg-card shadow-lg">
      <CardContent className="p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Timeline (Last Hour)</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {currentTime}
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 transform -translate-y-1/2" />
          <div className="relative flex justify-between items-center">
            {timeline.map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex flex-col items-center focus:outline-none group"
                      onClick={() => handleTimeClick(item)}
                      aria-label={`Select time: ${item.time}`}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full border border-primary bg-background transition-all",
                          selectedTime === item.time && "w-3 h-3 bg-primary",
                          item.isCurrent &&
                            "ring-1 ring-primary ring-offset-1 ring-offset-background"
                        )}
                      />
                      <span className="mt-1 text-[8px] font-medium transition-colors whitespace-nowrap">
                        {item.time === "Now"
                          ? item.time
                          : item.time.split(" ")[0]}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {item.time}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
