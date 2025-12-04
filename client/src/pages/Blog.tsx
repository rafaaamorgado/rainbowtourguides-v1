import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Search, TrendingUp, MapPin } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  featured_image_url: string;
  featured_image_alt: string;
  category_id: string;
  tags: string[];
  status: string;
  published_at: string;
  view_count: number;
  featured: boolean;
  created_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog/categories"],
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || post.category_id === selectedCategory;

    return matchesSearch && matchesCategory && post.status === "published";
  });

  const featuredPosts = filteredPosts?.filter((post) => post.featured).slice(0, 3);
  const regularPosts = filteredPosts?.filter((post) => !post.featured);

  if (postsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            LGBTQ+ Travel Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover city guides, travel tips, and stories from our vibrant community
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-12">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="all">All Articles</TabsTrigger>
            {categories?.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-8">
            {featuredPosts && featuredPosts.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h2 className="text-2xl font-bold">Featured Articles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts?.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className={`group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 h-full ${featured ? 'border-orange-200' : ''}`}>
        {post.featured_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {featured && (
              <Badge className="absolute top-4 right-4 bg-orange-600">
                Featured
              </Badge>
            )}
          </div>
        )}
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="group-hover:text-orange-600 transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
          {post.subtitle && (
            <CardDescription className="line-clamp-1">{post.subtitle}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.published_at), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
