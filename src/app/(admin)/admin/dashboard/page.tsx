"use client";

import { ShoppingCart, Package, Users, Flame } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/components/admin/stat-card";
import { ChartCard } from "@/components/admin/chart-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const revenueData = [
  { day: "3/5", amount: 180000 },
  { day: "3/6", amount: 250000 },
  { day: "3/7", amount: 120000 },
  { day: "3/8", amount: 310000 },
  { day: "3/9", amount: 95000 },
  { day: "3/10", amount: 200000 },
  { day: "3/11", amount: 95000 },
];

const recentOrders = [
  { id: "order-10", user: "소연쓰", capsule: "라이트 캡슐", product: "볼펜 세트", amount: 5000, status: "DELIVERED" as const, date: "2026-03-07" },
  { id: "order-9", user: "민준이", capsule: "시즌 한정 캡슐", product: "닌텐도 스위치 2", amount: 50000, status: "OPENED" as const, date: "2026-03-05" },
  { id: "order-8", user: "소연쓰", capsule: "스탠다드 캡슐", product: "핸드크림 세트", amount: 15000, status: "SHIPPING" as const, date: "2026-03-03" },
  { id: "order-7", user: "민준이", capsule: "스탠다드 캡슐", product: "JBL 블루투스 스피커", amount: 15000, status: "DELIVERED" as const, date: "2026-03-02" },
  { id: "order-6", user: "소연쓰", capsule: "시즌 한정 캡슐", product: "아이패드 프로 11인치", amount: 50000, status: "STORED" as const, date: "2026-03-01" },
];

const statusColors: Record<string, string> = {
  OPENED: "bg-blue-100 text-blue-700",
  STORED: "bg-emerald-100 text-emerald-700",
  DECOMPOSED: "bg-gray-100 text-gray-600",
  SHIPPING: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-purple-100 text-purple-700",
};

const statusLabels: Record<string, string> = {
  OPENED: "오픈됨",
  STORED: "보관중",
  DECOMPOSED: "분해됨",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingCart}
          label="오늘 매출"
          value="₩1,250,000"
          change={{ value: 12 }}
        />
        <StatCard
          icon={Package}
          label="주문수"
          value="42건"
          change={{ value: 8 }}
        />
        <StatCard
          icon={Users}
          label="신규회원"
          value="8명"
          change={{ value: -5 }}
        />
        <StatCard
          icon={Flame}
          label="피버 진행률"
          value="65%"
          change={{ value: 15 }}
        />
      </div>

      {/* 매출 차트 */}
      <ChartCard title="최근 7일 매출">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
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
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 최근 주문 */}
      <Card className="gap-0 py-0">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium">최근 주문</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>주문번호</TableHead>
                <TableHead>유저</TableHead>
                <TableHead>캡슐</TableHead>
                <TableHead>상품</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{order.capsule}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell className="text-right">
                    ₩{order.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
