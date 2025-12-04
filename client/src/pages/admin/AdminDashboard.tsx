import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RoleGate from "@/components/RoleGate";
import UsersAdmin from "./UsersAdmin";
import GuidesAdmin from "./GuidesAdmin";
import BookingsAdmin from "./BookingsAdmin";
import ReviewsAdmin from "./ReviewsAdmin";
import CitiesAdmin from "./CitiesAdmin";

type Tab = "overview" | "users" | "guides" | "bookings" | "reviews" | "cities" | "settings";

interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalGuides: number;
  verifiedGuides: number;
  pendingVerifications: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  commissionRevenue: number;
  activeReports: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data: stats } = useQuery<PlatformStats>({
    queryKey: ["/api/admin/stats"],
  });

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "fa-chart-line" },
    { id: "users", label: "Users", icon: "fa-users" },
    { id: "guides", label: "Guides", icon: "fa-map-marked-alt" },
    { id: "bookings", label: "Bookings", icon: "fa-calendar-check" },
    { id: "reviews", label: "Reviews", icon: "fa-star" },
    { id: "cities", label: "Cities", icon: "fa-map-pin" },
    { id: "settings", label: "Settings", icon: "fa-cog" },
  ];

  return (
    <RoleGate allowedRoles={["admin"]}>
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-admin-title">
              Admin Console
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage users, guides, bookings, and reviews
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
            <div className="border-b border-border bg-muted/30">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary text-primary bg-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <i className={`fas ${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === "overview" && <OverviewTab stats={stats} />}
              {activeTab === "users" && <UsersAdmin />}
              {activeTab === "guides" && <GuidesAdmin />}
              {activeTab === "bookings" && <BookingsAdmin />}
              {activeTab === "reviews" && <ReviewsAdmin />}
              {activeTab === "cities" && <CitiesAdmin />}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}

function OverviewTab({ stats }: { stats?: PlatformStats }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            subtitle={`${stats?.activeUsers || 0} active`}
            icon="fa-users"
            color="blue"
          />
          <StatCard
            title="Total Guides"
            value={stats?.totalGuides || 0}
            subtitle={`${stats?.verifiedGuides || 0} verified`}
            icon="fa-map-marked-alt"
            color="green"
          />
          <StatCard
            title="Bookings"
            value={stats?.totalBookings || 0}
            subtitle={`${stats?.pendingBookings || 0} pending`}
            icon="fa-calendar-check"
            color="purple"
          />
          <StatCard
            title="Revenue"
            value={`$${((stats?.totalRevenue || 0) / 100).toLocaleString()}`}
            subtitle={`$${((stats?.commissionRevenue || 0) / 100).toLocaleString()} commission`}
            icon="fa-dollar-sign"
            color="amber"
          />
        </div>

        {/* Alerts */}
        {stats && (stats.pendingVerifications > 0 || stats.activeReports > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {stats.pendingVerifications > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="fas fa-exclamation-triangle text-amber-600 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                      Pending Verifications
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {stats.pendingVerifications} guide applications waiting for review
                    </p>
                  </div>
                </div>
              </div>
            )}
            {stats.activeReports > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="fas fa-flag text-red-600 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">
                      Active Reports
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {stats.activeReports} safety reports need attention
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors text-left">
              <i className="fas fa-user-check text-primary text-xl mb-2"></i>
              <div className="font-medium text-sm">Review Guides</div>
            </button>
            <button className="p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors text-left">
              <i className="fas fa-calendar text-primary text-xl mb-2"></i>
              <div className="font-medium text-sm">Manage Bookings</div>
            </button>
            <button className="p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors text-left">
              <i className="fas fa-flag text-primary text-xl mb-2"></i>
              <div className="font-medium text-sm">Safety Reports</div>
            </button>
            <button className="p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors text-left">
              <i className="fas fa-cog text-primary text-xl mb-2"></i>
              <div className="font-medium text-sm">Settings</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className={`w-10 h-10 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center text-white`}>
          <i className={`fas ${icon}`}></i>
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>

      <div className="grid gap-6">
        {/* Commission Settings */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Platform Commission (%)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-2 border border-input rounded-lg"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Traveler Service Fee (%)</label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-2 border border-input rounded-lg"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Cancellation Policy</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">48+ hours before (%)</label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-4 py-2 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">24-48 hours (%)</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-2 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Under 24 hours (%)</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="w-full px-4 py-2 border border-input rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Gateways</h3>
          <div className="space-y-3">
            {['Stripe', 'PayPal', 'MoMo', 'ZaloPay'].map(gateway => (
              <label key={gateway} className="flex items-center gap-3">
                <input type="checkbox" defaultChecked={gateway === 'Stripe' || gateway === 'PayPal'} className="w-4 h-4" />
                <span>{gateway}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
          Save Settings
        </button>
      </div>
    </div>
  );
}
