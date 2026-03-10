import { getCapsules, getFeverStatus, getProductById } from "@/lib/data-source";
import { CapsuleCard } from "@/components/user/capsule-card";
import { FeverGaugeSection } from "@/components/user/fever-gauge-section";

export default async function HomePage() {
  const [capsules, feverData] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
  ]);

  const rewardProduct = await getProductById(feverData.config.rewardProductId);

  return (
    <div>
      {/* Fever Gauge (full component) */}
      <FeverGaugeSection
        initialData={{
          currentAmount: feverData.progress.currentAmount,
          targetAmount: feverData.config.targetAmount,
          percentage: feverData.progress.percentage,
          isActive: feverData.progress.isActive,
        }}
        rewardProduct={rewardProduct}
      />

      {/* Capsule List */}
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
