import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Eye, ArrowLeft, Share2, MapPin } from "lucide-react";
import { format } from "date-fns";
import ShareButtons from "@/components/ShareButtons";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  featured_image_url: string;
  featured_image_alt: string;
  category_id: string;
  tags: string[];
  status: string;
  published_at: string;
  view_count: number;
  seo_title: string;
  seo_description: string;
  related_city_slugs: string[];
  created_at: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;

  const { data: post, isLoading: postLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/posts/${slug}`],
    enabled: !!slug,
  });

  const { data: category } = useQuery<BlogCategory>({
    queryKey: [`/api/blog/categories/${post?.category_id}`],
    enabled: !!post?.category_id,
  });

  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog/posts?category=${post?.category_id}&limit=3`],
    enabled: !!post?.category_id,
  });

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <h2 className="text-2xl font-bold">Article Not Found</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {post.featured_image_url && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={post.featured_image_url}
                alt={post.featured_image_alt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <Badge className="bg-orange-600">
                  {category.name}
                </Badge>
              )}
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-2xl text-gray-600 mb-6">{post.subtitle}</p>
            )}

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.view_count} views</span>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-600">Share this article:</span>
              <ShareButtons
                url={`${window.location.origin}/blog/${post.slug}`}
                title={post.title}
              />
            </div>
          </div>

          <Card className="mb-12">
            <CardContent className="prose prose-lg max-w-none pt-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: post.body.replace(/\n/g, '<br/>'),
                }}
              />
            </CardContent>
          </Card>

          {post.related_city_slugs && post.related_city_slugs.length > 0 && (
            <Card className="mb-12 bg-gradient-to-r from-orange-50 to-pink-50">
              <CardHeader>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Related Destinations
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {post.related_city_slugs.map((citySlug) => (
                    <Link key={citySlug} href={`/cities/${citySlug}`}>
                      <Button variant="outline" className="capitalize">
                        {citySlug.replace(/-/g, ' ')}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {relatedPosts && relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 3)
                  .map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all h-full">
                        {relatedPost.featured_image_url && (
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={relatedPost.featured_image_url}
                              alt={relatedPost.featured_image_alt || relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <h4 className="font-bold line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
