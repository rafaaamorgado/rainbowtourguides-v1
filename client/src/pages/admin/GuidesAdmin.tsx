import { useQuery } from "@tanstack/react-query";
import type { GuideProfile } from "@shared/schema";

export default function GuidesAdmin() {
  const { data: guides, isLoading } = useQuery<GuideProfile[]>({
    queryKey: ["/api/admin/guides"],
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading guides...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Guides</h2>
        <p className="text-muted-foreground" data-testid="text-guides-count">
          {guides?.length || 0} total guides
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Guide
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guides?.map((guide) => (
                <tr key={guide.uid} className="hover:bg-muted/20" data-testid={`row-guide-${guide.uid}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={guide.avatarUrl || "https://i.pravatar.cc/40"}
                        alt={guide.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-sm">{guide.displayName}</div>
                        <div className="text-xs text-muted-foreground">@{guide.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {guide.city}, {guide.country}
                  </td>
                  <td className="px-4 py-3">
                    {guide.verified ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1 w-fit">
                        <i className="fas fa-check-circle"></i>Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <i className="fas fa-star text-yellow-500 text-xs"></i>
                      <span>{guide.ratingAvg.toFixed(1)}</span>
                      <span className="text-muted-foreground">({guide.ratingCount})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="View Profile"
                        data-testid={`button-view-guide-${guide.uid}`}
                      >
                        <i className="fas fa-eye text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="Edit"
                        data-testid={`button-edit-guide-${guide.uid}`}
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="More"
                        data-testid={`button-more-guide-${guide.uid}`}
                      >
                        <i className="fas fa-ellipsis-h text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
