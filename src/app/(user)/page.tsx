import { getCapsules, getFeverStatus } from "@/lib/data-source";
import { CapsuleCard } from "@/components/user/capsule-card";
import { FeverBar } from "@/components/user/fever-bar";

export default async function HomePage() {
  const [capsules, feverData] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
  ]);

  return (
    <div>
      {/* Fever Gauge */}
      <FeverBar
        percentage={feverData.progress.percentage}
        currentAmount={feverData.progress.currentAmount}
        targetAmount={feverData.config.targetAmount}
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
