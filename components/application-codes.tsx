import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

type ApplicationCode = {
  name: string;
  code: string;
};

type ApplicationCodesProps = {
  codes: ApplicationCode[];
};

export function ApplicationCodes({ codes }: ApplicationCodesProps) {
  return (
    <Card className="h-full border-l-4 border-l-orange-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          Application Codes
          <Shield className="ml-auto h-4 w-4 text-orange-500" />
          <span className="ml-1.5 text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full">
            External
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-1">
          {codes.map((app) => (
            <div
              key={app.code}
              className="flex justify-between items-center text-xs p-1.5 bg-muted/30 rounded h-7"
            >
              <span className="font-medium">{app.code}</span>
              <span className="text-muted-foreground text-xs">{app.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
