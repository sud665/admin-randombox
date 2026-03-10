"use client";

import { useState, useEffect, useMemo } from "react";
import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product, FeverConfig, FeverProgress, FeverWinner, User } from "@/types";

export default function FeverPage() {
  const [config, setConfig] = useState<FeverConfig | null>(null);
  const [progress, setProgress] = useState<FeverProgress | null>(null);
  const [winners, setWinners] = useState<FeverWinner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form state
  const [targetAmount, setTargetAmount] = useState(0);
  const [rewardProductId, setRewardProductId] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    import("@/mocks/fever.json").then((m) => {
      const data = m.default as { config: FeverConfig; progress: FeverProgress; winners: FeverWinner[] };
      setConfig(data.config);
      setProgress(data.progress);
      setWinners(data.winners);
      setTargetAmount(data.config.targetAmount);
      setRewardProductId(data.config.rewardProductId);
      setIsActive(data.config.isActive);
    });
    import("@/mocks/products.json").then((m) => setProducts(m.default as Product[]));
    import("@/mocks/users.json").then((m) => setUsers(m.default as User[]));
  }, []);

  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((u) => map.set(u.id, u.nickname));
    return map;
  }, [users]);

  const productMap = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [products]);

  const percentage = progress
    ? Math.min(100, (progress.currentAmount / (config?.targetAmount ?? 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">피버 설정</h2>

      {/* 현재 피버 상태 카드 */}
      <Card className="gap-0 py-0">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Flame className="h-4 w-4 text-orange-500" />
            현재 피버 상태
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-5 space-y-3">
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">
              ₩{(progress?.currentAmount ?? 0).toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              / ₩{(config?.targetAmount ?? 0).toLocaleString()}
            </span>
          </div>
          {/* 게이지 바 */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(1)}% 달성</span>
            <span
              className={`font-medium ${
                progress?.isActive ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {progress?.isActive ? "진행중" : "비활성"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 설정 폼 */}
      <Card className="gap-0 py-0">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium">피버 설정</CardTitle>
        </CardHeader>
        <CardContent className="pb-5 space-y-4">
          <div className="grid gap-2">
            <Label>목표 금액</Label>
            <Input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label>보상 상품</Label>
            <Select value={rewardProductId} onValueChange={(val) => val && setRewardProductId(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="상품 선택" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    [{p.grade}] {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onCheckedChange={(val) => setIsActive(!!val)}
            />
            <Label className="text-sm">피버 활성화</Label>
          </div>
          <Button
            size="sm"
            onClick={() => {
              // mock 저장
              if (config) {
                setConfig({
                  ...config,
                  targetAmount,
                  rewardProductId,
                  isActive,
                });
              }
            }}
          >
            설정 저장
          </Button>
        </CardContent>
      </Card>

      {/* 피버 히스토리 */}
      <Card className="gap-0 py-0">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium">당첨자 기록</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>당첨자</TableHead>
                <TableHead>보상 상품</TableHead>
                <TableHead>당첨일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-16 text-center text-muted-foreground">
                    당첨 기록이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                winners.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">
                      {userMap.get(w.userId) ?? w.userId}
                    </TableCell>
                    <TableCell>{productMap.get(w.productId) ?? w.productId}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(w.wonAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
