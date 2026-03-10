"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartCard } from "@/components/admin/chart-card";

// Mock 데이터
const weeklyRevenue = [
  { date: "3/5", amount: 180000 },
  { date: "3/6", amount: 250000 },
  { date: "3/7", amount: 120000 },
  { date: "3/8", amount: 310000 },
  { date: "3/9", amount: 95000 },
  { date: "3/10", amount: 200000 },
  { date: "3/11", amount: 95000 },
];

const monthlyRevenue = [
  { date: "2/1주", amount: 450000 },
  { date: "2/2주", amount: 680000 },
  { date: "2/3주", amount: 520000 },
  { date: "2/4주", amount: 390000 },
  { date: "3/1주", amount: 750000 },
  { date: "3/2주", amount: 610000 },
];

const quarterlyRevenue = [
  { date: "1월", amount: 2800000 },
  { date: "2월", amount: 3200000 },
  { date: "3월", amount: 1850000 },
];

const weeklyCapsuleSales = [
  { name: "프리미엄", sales: 12 },
  { name: "스탠다드", sales: 25 },
  { name: "라이트", sales: 38 },
  { name: "시즌한정", sales: 8 },
];

const monthlyCapsuleSales = [
  { name: "프리미엄", sales: 45 },
  { name: "스탠다드", sales: 92 },
  { name: "라이트", sales: 134 },
  { name: "시즌한정", sales: 28 },
];

const quarterlyCapsuleSales = [
  { name: "프리미엄", sales: 120 },
  { name: "스탠다드", sales: 280 },
  { name: "라이트", sales: 410 },
  { name: "시즌한정", sales: 85 },
];

const weeklyGradeDistribution = [
  { name: "S등급", value: 3, color: "#f59e0b" },
  { name: "A등급", value: 12, color: "#8b5cf6" },
  { name: "B등급", value: 25, color: "#3b82f6" },
  { name: "C등급", value: 30, color: "#10b981" },
  { name: "D등급", value: 30, color: "#6b7280" },
];

const monthlyGradeDistribution = [
  { name: "S등급", value: 8, color: "#f59e0b" },
  { name: "A등급", value: 35, color: "#8b5cf6" },
  { name: "B등급", value: 72, color: "#3b82f6" },
  { name: "C등급", value: 95, color: "#10b981" },
  { name: "D등급", value: 90, color: "#6b7280" },
];

const quarterlyGradeDistribution = [
  { name: "S등급", value: 22, color: "#f59e0b" },
  { name: "A등급", value: 95, color: "#8b5cf6" },
  { name: "B등급", value: 210, color: "#3b82f6" },
  { name: "C등급", value: 280, color: "#10b981" },
  { name: "D등급", value: 288, color: "#6b7280" },
];

type Period = "week" | "month" | "quarter";

const revenueMap: Record<Period, typeof weeklyRevenue> = {
  week: weeklyRevenue,
  month: monthlyRevenue,
  quarter: quarterlyRevenue,
};

const capsuleMap: Record<Period, typeof weeklyCapsuleSales> = {
  week: weeklyCapsuleSales,
  month: monthlyCapsuleSales,
  quarter: quarterlyCapsuleSales,
};

const gradeMap: Record<Period, typeof weeklyGradeDistribution> = {
  week: weeklyGradeDistribution,
  month: monthlyGradeDistribution,
  quarter: quarterlyGradeDistribution,
};

function RevenueChart({ data }: { data: typeof weeklyRevenue }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(Number(v) / 10000).toFixed(0)}만`}
        />
        <Tooltip
          formatter={(value) => [`₩${Number(value).toLocaleString()}`, "매출"]}
          contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--primary))", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CapsuleSalesChart({ data }: { data: typeof weeklyCapsuleSales }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(value) => [`${Number(value)}건`, "판매량"]}
          contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
        />
        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function GradeDistributionChart({ data }: { data: typeof weeklyGradeDistribution }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
          fontSize={11}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${Number(value)}건`, name]}
          contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">통계</h2>

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">이번 주</TabsTrigger>
          <TabsTrigger value="month">이번 달</TabsTrigger>
          <TabsTrigger value="quarter">최근 3개월</TabsTrigger>
        </TabsList>

        {(["week", "month", "quarter"] as Period[]).map((period) => (
          <TabsContent key={period} value={period}>
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="매출 추이" className="lg:col-span-2">
                <RevenueChart data={revenueMap[period]} />
              </ChartCard>
              <ChartCard title="캡슐별 판매량">
                <CapsuleSalesChart data={capsuleMap[period]} />
              </ChartCard>
              <ChartCard title="등급별 당첨 분포">
                <GradeDistributionChart data={gradeMap[period]} />
              </ChartCard>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
