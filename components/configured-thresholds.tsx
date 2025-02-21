import type { Threshold } from "@/components/threshold-setting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ConfiguredThresholdsProps {
  title: string;
  thresholds: Threshold[];
  onDelete: (id: string) => void;
}

export function ConfiguredThresholds({
  title,
  thresholds,
  onDelete,
}: ConfiguredThresholdsProps) {
  if (thresholds.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Poll Strategy</TableHead>
              <TableHead>Poll Value</TableHead>
              <TableHead>Notify As</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {thresholds.map((threshold) => (
              <TableRow key={threshold.id}>
                <TableCell>{threshold.condition}</TableCell>
                <TableCell>{threshold.threshold} ms</TableCell>
                <TableCell>{threshold.pollStrategy}</TableCell>
                <TableCell>{threshold.pollValue} min</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        threshold.notifyAs === "Yellow"
                          ? "bg-yellow-500"
                          : "bg-orange-700"
                      }`}
                    />
                    {threshold.notifyAs === "Yellow" ? "Trouble" : "Critical"}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(threshold.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
