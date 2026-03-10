"use client";

import { useState } from "react";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminSidebar } from "./sidebar";

export function AdminHeader({ title }: { title?: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      {/* 모바일 햄버거 메뉴 */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSheetOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">메뉴 열기</span>
      </Button>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">네비게이션 메뉴</SheetTitle>
          <AdminSidebar onNavigate={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 페이지 타이틀 */}
      <h1 className="text-lg font-semibold">{title ?? "대시보드"}</h1>

      <div className="ml-auto" />

      {/* 관리자 아바타/드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" />
          }
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>프로필</DropdownMenuItem>
          <DropdownMenuItem>설정</DropdownMenuItem>
          <DropdownMenuItem>로그아웃</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
