import { UserHeader } from "@/components/user/header";
import { BottomNav } from "@/components/user/bottom-nav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-white shadow-xl">
        <UserHeader />
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
