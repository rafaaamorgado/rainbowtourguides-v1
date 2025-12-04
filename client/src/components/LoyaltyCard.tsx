import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface LoyaltyPerk {
  tier: string;
  perk_type: string;
  value: Record<string, any>;
  description: string;
}

interface LoyaltyCardProps {
  tier: string;
  points: number;
}

const tierColors = {
  bronze: "from-amber-700 to-amber-900",
  silver: "from-gray-400 to-gray-600",
  gold: "from-yellow-400 to-yellow-600",
  platinum: "from-purple-500 to-indigo-600",
};

const tierIcons = {
  bronze: "fa-trophy",
  silver: "fa-medal",
  gold: "fa-crown",
  platinum: "fa-gem",
};

const nextTierPoints = {
  bronze: 1000,
  silver: 5000,
  gold: 15000,
  platinum: null,
};

export default function LoyaltyCard({ tier, points }: LoyaltyCardProps) {
  const { data: perks } = useQuery<LoyaltyPerk[]>({
    queryKey: ["/api/loyalty-perks", tier],
  });

  const currentTierPerks = perks?.filter(p => p.tier === tier) || [];
  const nextPoints = nextTierPoints[tier as keyof typeof nextTierPoints];
  const progress = nextPoints ? (points / nextPoints) * 100 : 100;

  const nextTier = tier === "bronze" ? "Silver" :
                   tier === "silver" ? "Gold" :
                   tier === "gold" ? "Platinum" : null;

  return (
    <div className="space-y-4">
      {/* Loyalty Tier Card */}
      <Card className={`relative overflow-hidden bg-gradient-to-br ${tierColors[tier as keyof typeof tierColors]} text-white p-6`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Your Status</p>
              <h3 className="text-2xl font-bold capitalize">{tier} Member</h3>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <i className={`fas ${tierIcons[tier as keyof typeof tierIcons]} text-3xl`}></i>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{points.toLocaleString()} points</span>
              {nextPoints && (
                <span>{nextPoints.toLocaleString()} to {nextTier}</span>
              )}
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          {tier === "platinum" && (
            <p className="text-sm mt-3 opacity-90">
              🎉 You've reached the highest tier! Enjoy all exclusive benefits.
            </p>
          )}
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      </Card>

      {/* Perks List */}
      {currentTierPerks.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-gift text-primary"></i>
            Your Benefits
          </h4>
          <div className="space-y-3">
            {currentTierPerks.map((perk, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="mt-1">
                  {perk.perk_type === "discount" && <i className="fas fa-percent text-green-600"></i>}
                  {perk.perk_type === "priority_booking" && <i className="fas fa-clock text-blue-600"></i>}
                  {perk.perk_type === "free_cancellation" && <i className="fas fa-undo text-purple-600"></i>}
                  {perk.perk_type === "concierge" && <i className="fas fa-concierge-bell text-amber-600"></i>}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How to Earn Points */}
      <Card className="p-6 bg-muted/30">
        <h4 className="font-semibold mb-3 text-sm">Earn More Points</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Complete a booking: +100 points</p>
          <p>• Leave a review: +25 points</p>
          <p>• Refer a friend: +500 points</p>
          <p>• Book multiple tours: +50 bonus points per booking</p>
        </div>
      </Card>
    </div>
  );
}
