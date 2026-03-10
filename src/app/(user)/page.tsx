import { Package } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold">랜덤박스에 오신 것을 환영합니다!</h2>
      <p className="text-center text-sm text-muted-foreground">
        다양한 캡슐을 열어 특별한 상품을 만나보세요.
        <br />
        이 페이지는 곧 캡슐 리스트로 교체됩니다.
      </p>
    </div>
  );
}
