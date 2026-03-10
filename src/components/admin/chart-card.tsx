"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {children}
      </CardContent>
    </Card>
  );
}
