import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabaseAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Image,
  Mail,
  BarChart3,
  Tags,
  Megaphone,
  TestTube,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  blogPosts: { total: number; draft: number; published: number; scheduled: number };
  campaigns: { total: number; sent: number; scheduled: number };
  pages: { total: number; draft: number; published: number };
  pendingApprovals: number;
  recentActivity: Array<{
    id: string;
    action: string;
    content: string;
    timestamp: string;
  }>;
}

export default function ManagerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
    loadDashboardData();
  }, []);

  async function checkAccess() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLocation("/auth/demo-login");
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || (userData.role !== "manager" && userData.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You need marketing manager permissions to access this area.",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    setUserRole(userData.role);
  }

  async function loadDashboardData() {
    try {
      const [blogData, campaignsData, pagesData, approvalsData, activityData] = await Promise.all([
        supabase.from("blog_posts").select("status"),
        supabase.from("email_campaigns").select("status"),
        supabase.from("cms_pages").select("status"),
        supabase.from("content_approvals").select("*").eq("status", "pending"),
        supabase
          .from("marketing_changelog")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const blogStats = {
        total: blogData.data?.length || 0,
        draft: blogData.data?.filter(p => p.status === "draft").length || 0,
        published: blogData.data?.filter(p => p.status === "published").length || 0,
        scheduled: blogData.data?.filter(p => p.status === "draft").length || 0,
      };

      const campaignStats = {
        total: campaignsData.data?.length || 0,
        sent: campaignsData.data?.filter(c => c.status === "sent").length || 0,
        scheduled: campaignsData.data?.filter(c => c.status === "scheduled").length || 0,
      };

      const pageStats = {
        total: pagesData.data?.length || 0,
        draft: pagesData.data?.filter(p => p.status === "draft").length || 0,
        published: pagesData.data?.filter(p => p.status === "published").length || 0,
      };

      setStats({
        blogPosts: blogStats,
        campaigns: campaignStats,
        pages: pageStats,
        pendingApprovals: approvalsData.data?.length || 0,
        recentActivity: activityData.data?.map(a => ({
          id: a.id,
          action: a.action_type,
          content: a.title,
          timestamp: new Date(a.created_at).toLocaleString(),
        })) || [],
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Manage content, campaigns, and analytics</p>
        </div>
        <Button onClick={() => setLocation("/manager/blog/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      {stats && stats.pendingApprovals > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {stats.pendingApprovals} item{stats.pendingApprovals !== 1 ? 's' : ''} pending approval.{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/manager/approvals")}>
              View approvals
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/manager/blog")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blogPosts.total || 0}</div>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Edit className="h-3 w-3" /> {stats?.blogPosts.draft || 0} drafts
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> {stats?.blogPosts.published || 0} live
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/manager/campaigns")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.campaigns.total || 0}</div>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> {stats?.campaigns.sent || 0} sent
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {stats?.campaigns.scheduled || 0} scheduled
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/manager/pages")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CMS Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pages.total || 0}</div>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Edit className="h-3 w-3" /> {stats?.pages.draft || 0} drafts
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> {stats?.pages.published || 0} live
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/manager/analytics")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Stats</div>
            <p className="text-xs text-muted-foreground mt-2">
              Traffic, conversions, and performance metrics
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common marketing tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/blog/new")}>
                <FileText className="h-5 w-5 mb-2" />
                <span className="font-semibold">New Blog Post</span>
                <span className="text-xs text-muted-foreground">Write an article</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/campaigns/new")}>
                <Mail className="h-5 w-5 mb-2" />
                <span className="font-semibold">Email Campaign</span>
                <span className="text-xs text-muted-foreground">Create campaign</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/pages/new")}>
                <FileText className="h-5 w-5 mb-2" />
                <span className="font-semibold">New Page</span>
                <span className="text-xs text-muted-foreground">Create landing page</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/media")}>
                <Image className="h-5 w-5 mb-2" />
                <span className="font-semibold">Media Library</span>
                <span className="text-xs text-muted-foreground">Manage images</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/banners")}>
                <Megaphone className="h-5 w-5 mb-2" />
                <span className="font-semibold">Promo Banner</span>
                <span className="text-xs text-muted-foreground">Create announcement</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/seo")}>
                <Tags className="h-5 w-5 mb-2" />
                <span className="font-semibold">SEO Manager</span>
                <span className="text-xs text-muted-foreground">Optimize metadata</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest marketing actions</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{activity.content}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Tools</CardTitle>
          <CardDescription>Advanced features and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/ab-tests")}>
                  <TestTube className="h-5 w-5 mb-2" />
                  <span className="font-semibold">A/B Testing</span>
                  <span className="text-xs text-muted-foreground">Run experiments</span>
                </Button>

                <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/utm")}>
                  <Tags className="h-5 w-5 mb-2" />
                  <span className="font-semibold">UTM Builder</span>
                  <span className="text-xs text-muted-foreground">Track campaigns</span>
                </Button>

                <Button variant="outline" className="h-auto flex-col items-start p-4" onClick={() => setLocation("/manager/affiliates")}>
                  <Users className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Affiliates</span>
                  <span className="text-xs text-muted-foreground">Manage partners</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">View detailed traffic analytics</p>
                    <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setLocation("/manager/analytics")}>
                      View Analytics →
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Conversion Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Monitor conversions and ROI</p>
                    <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setLocation("/manager/analytics")}>
                      View Conversions →
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <p className="text-sm text-muted-foreground">Manage your email marketing campaigns</p>
              <Button onClick={() => setLocation("/manager/campaigns")}>View All Campaigns</Button>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm"><strong>Google Analytics:</strong> Connected</p>
                <p className="text-sm"><strong>Meta Pixel:</strong> Not configured</p>
                <p className="text-sm"><strong>Email Service:</strong> Resend (Active)</p>
              </div>
              <Button variant="outline" size="sm">Configure Integrations</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
