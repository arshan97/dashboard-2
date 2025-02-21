"use client";

import { useState } from "react";
import {
  ThresholdSetting,
  type Threshold,
} from "@/components/threshold-setting";
import { ConfiguredThresholds } from "@/components/configured-thresholds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ThresholdsPage() {
  const [dnsRecordThresholds, setDnsRecordThresholds] = useState<Threshold[]>(
    []
  );
  const [dnsProviderThresholds, setDnsProviderThresholds] = useState<
    Threshold[]
  >([]);

  const addDnsRecordThreshold = (newThreshold: Threshold) => {
    setDnsRecordThresholds([...dnsRecordThresholds, newThreshold]);
  };

  const addDnsProviderThreshold = (newThreshold: Threshold) => {
    setDnsProviderThresholds([...dnsProviderThresholds, newThreshold]);
  };

  const deleteDnsRecordThreshold = (id: string) => {
    setDnsRecordThresholds(dnsRecordThresholds.filter((t) => t.id !== id));
  };

  const deleteDnsProviderThreshold = (id: string) => {
    setDnsProviderThresholds(dnsProviderThresholds.filter((t) => t.id !== id));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Thresholds</h1>

      <Tabs defaultValue="dns-records" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dns-records">DNS Records</TabsTrigger>
          <TabsTrigger value="dns-provider">DNS Provider</TabsTrigger>
        </TabsList>
        <TabsContent value="dns-records" className="space-y-6">
          <ThresholdSetting
            title="DNS Records Response Time Threshold"
            onAddThreshold={addDnsRecordThreshold}
          />
          <ConfiguredThresholds
            title="Configured DNS Record Thresholds"
            thresholds={dnsRecordThresholds}
            onDelete={deleteDnsRecordThreshold}
          />
        </TabsContent>
        <TabsContent value="dns-provider" className="space-y-6">
          <ThresholdSetting
            title="DNS Provider Response Time Threshold"
            onAddThreshold={addDnsProviderThreshold}
          />
          <ConfiguredThresholds
            title="Configured DNS Provider Thresholds"
            thresholds={dnsProviderThresholds}
            onDelete={deleteDnsProviderThreshold}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
