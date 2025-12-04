import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function UsersAdmin() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const roleColors = {
    traveler: "bg-blue-100 text-blue-700",
    guide: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
    support: "bg-green-100 text-green-700",
    moderator: "bg-yellow-100 text-yellow-700",
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Users</h2>
        <p className="text-muted-foreground" data-testid="text-users-count">
          {users?.length || 0} total users
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20" data-testid={`row-user-${user.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || "https://i.pravatar.cc/40"}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-sm">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">{user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.email || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="View Profile"
                        data-testid={`button-view-${user.id}`}
                      >
                        <i className="fas fa-eye text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="Edit"
                        data-testid={`button-edit-${user.id}`}
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded focus-ring"
                        title="More"
                        data-testid={`button-more-${user.id}`}
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
