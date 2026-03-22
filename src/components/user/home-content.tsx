import { getCapsules, getFeverStatus, getProductById } from "@/lib/data-source";
import { CapsuleCard } from "@/components/user/capsule-card";
import { FeverGaugeSection } from "@/components/user/fever-gauge-section";

export async function HomeContent() {
  const [capsules, feverData] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
  ]);

  const rewardProduct = feverData?.config?.rewardProductId
    ? await getProductById(feverData.config.rewardProductId)
    : null;

  return (
    <div>
      <FeverGaugeSection
        initialData={{
          currentAmount: feverData?.progress?.currentAmount ?? 0,
          targetAmount: feverData?.config?.targetAmount ?? 5000000,
          percentage: feverData?.progress?.percentage ?? 0,
          isActive: feverData?.progress?.isActive ?? true,
        }}
        rewardProduct={rewardProduct}
      />
      <div className="px-4 pb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">캡슐 목록</h2>
        <div className="grid grid-cols-2 gap-3">
          {capsules.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} />
          ))}
        </div>
      </div>
    </div>
  );
}
