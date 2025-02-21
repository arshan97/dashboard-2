"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThresholdSettingProps {
  title: string;
  onAddThreshold: (threshold: Threshold) => void;
}

export interface Threshold {
  id: string;
  condition: ">" | "<";
  threshold: string;
  pollStrategy: string;
  pollValue: string;
  notifyAs: "Yellow" | "DarkOrange";
}

export function ThresholdSetting({
  title,
  onAddThreshold,
}: ThresholdSettingProps) {
  const [condition, setCondition] = useState<">" | "<">(">");
  const [threshold, setThreshold] = useState("");
  const [pollStrategy, setPollStrategy] = useState("Time Duration");
  const [pollValue, setPollValue] = useState("");
  const [notifyAs, setNotifyAs] = useState<"Yellow" | "DarkOrange">("Yellow");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (threshold && pollValue) {
      onAddThreshold({
        id: Date.now().toString(),
        condition,
        threshold,
        pollStrategy,
        pollValue,
        notifyAs,
      });
      // Reset form
      setThreshold("");
      setPollValue("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-6 gap-4 items-end">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={condition}
                onValueChange={(value: ">" | "<") => setCondition(value)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">Greater than (&gt;)</SelectItem>
                  <SelectItem value="<">Less than (&lt;)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="threshold">Threshold (ms)</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Enter value"
                required
              />
            </div>
            <div>
              <Label htmlFor="pollStrategy">Poll Strategy</Label>
              <Select value={pollStrategy} onValueChange={setPollStrategy}>
                <SelectTrigger id="pollStrategy">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Time Duration">Time Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pollValue">Poll Value (min)</Label>
              <Input
                id="pollValue"
                type="number"
                value={pollValue}
                onChange={(e) => setPollValue(e.target.value)}
                placeholder="Enter value"
                required
              />
            </div>
            <div>
              <Label htmlFor="notifyAs">Notify As</Label>
              <Select
                value={notifyAs}
                onValueChange={(value: "Yellow" | "DarkOrange") =>
                  setNotifyAs(value)
                }
              >
                <SelectTrigger id="notifyAs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yellow">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                      Trouble
                    </div>
                  </SelectItem>
                  <SelectItem value="DarkOrange">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-700 mr-2" />
                      Critical
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button type="submit" size="sm">
                Add Threshold
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
