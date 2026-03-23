"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  ShoppingCart,
  Truck,
  Flame,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/products", label: "상품관리", icon: Package },
  { href: "/admin/capsules", label: "캡슐관리", icon: Boxes },
  { href: "/admin/members", label: "회원관리", icon: Users },
  { href: "/admin/orders", label: "주문관리", icon: ShoppingCart },
  { href: "/admin/shipping", label: "배송관리", icon: Truck },
  { href: "/admin/fever", label: "피버설정", icon: Flame },
  { href: "/admin/reviews", label: "리뷰관리", icon: MessageSquare },
  { href: "/admin/stats", label: "통계", icon: BarChart3 },
] as const;

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/admin/dashboard"
          className="text-lg font-bold text-primary"
        >
          RANDBOX 관리자
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
