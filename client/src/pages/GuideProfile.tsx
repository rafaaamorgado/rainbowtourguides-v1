import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BookingForm from "@/components/BookingForm";
import AuthModal from "@/components/AuthModal";
import ShareButtons from "@/components/ShareButtons";
import ReviewCard from "@/components/ReviewCard";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import BlockGuideButton from "@/components/BlockGuideButton";
import { Button } from "@/components/ui/button";
import type { GuideProfile, Review, User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { obfuscateName } from "@/lib/privacy";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function GuideProfile() {
  const { handle } = useParams();
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isLoggedIn = isAuthenticated();
  const currentUser = getUser();

  const { data: guide, isLoading: guideLoading } = useQuery<GuideProfile>({
    queryKey: ["/api/guides", handle],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews/guide", guide?.uid],
    enabled: !!guide,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  if (guideLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading guide profile...</div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Guide not found</h2>
          <p className="text-muted-foreground">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  const coverImage = guide.photos[0] || "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1400&h=600&fit=crop";
  const displayName = isLoggedIn ? guide.displayName : obfuscateName(guide.displayName);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-xl">
          {/* Guide Header */}
          <div className="relative h-80 sm:h-96">
            <img
              src={coverImage}
              alt={`${guide.city} cityscape`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-end gap-6">
                <img
                  src={guide.avatarUrl || "https://i.pravatar.cc/120"}
                  alt={guide.displayName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white pride-ring"
                  data-testid="img-guide-avatar"
                />
                <div className="flex-1 text-white pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold" data-testid="text-guide-name">
                      {displayName}
                    </h1>
                    {guide.verified && (
                      <i className="fas fa-badge-check text-accent text-2xl" title="Verified Guide"></i>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-map-marker-alt"></i>
                      <span data-testid="text-guide-location">{guide.city}, {guide.country}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <i className="fas fa-star text-yellow-400"></i>
                      <span data-testid="text-guide-rating">{guide.ratingAvg.toFixed(1)}</span>
                      <span className="opacity-80">({guide.ratingCount} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guide Content */}
          <div className="grid lg:grid-cols-3 gap-8 p-6 sm:p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About {displayName.split(" ")[0]}</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-guide-bio">
                  {guide.bio}
                </p>
              </div>

              {/* Languages & Themes */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <i className="fas fa-language text-primary"></i>
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2" data-testid="list-languages">
                    {guide.languages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-muted rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <i className="fas fa-heart text-accent"></i>
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2" data-testid="list-themes">
                    {guide.themes.map((theme) => (
                      <span key={theme} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {guide.socialLinks && Object.values(guide.socialLinks).some(link => link) && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <i className="fas fa-share-nodes text-primary"></i>
                    Connect with {displayName.split(" ")[0]}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {guide.socialLinks.instagram && (
                      <a
                        href={guide.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <i className="fab fa-instagram"></i>
                        <span>Instagram</span>
                      </a>
                    )}
                    {guide.socialLinks.twitter && (
                      <a
                        href={guide.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <i className="fab fa-twitter"></i>
                        <span>Twitter</span>
                      </a>
                    )}
                    {guide.socialLinks.facebook && (
                      <a
                        href={guide.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <i className="fab fa-facebook-f"></i>
                        <span>Facebook</span>
                      </a>
                    )}
                    {guide.socialLinks.tiktok && (
                      <a
                        href={guide.socialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <i className="fab fa-tiktok"></i>
                        <span>TikTok</span>
                      </a>
                    )}
                    {guide.socialLinks.youtube && (
                      <a
                        href={guide.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <i className="fab fa-youtube"></i>
                        <span>YouTube</span>
                      </a>
                    )}
                    {guide.socialLinks.website && (
                      <a
                        href={guide.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                      >
                        <i className="fas fa-globe"></i>
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {guide.photos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Tour Highlights</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {guide.photos.slice(0, 3).map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Tour highlight ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        data-testid={`img-highlight-${idx}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h3 className="text-xl font-bold mb-6">Reviews ({reviews?.length || 0})</h3>
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const author = users?.find(u => u.id === review.authorUserId);
                      return (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          author={author}
                          canRespond={currentUser?.id === guide.uid}
                          canEdit={currentUser?.id === review.authorUserId}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ShareButtons
                    title={`Meet ${displayName} - LGBTQ+ Tour Guide in ${guide.city}`}
                    description={guide.bio.substring(0, 150)}
                    compact
                  />
                </div>
                {isLoggedIn && currentUser?.role === "traveler" && (
                  <BlockGuideButton
                    guideId={guide.uid}
                    guideName={displayName}
                    onBlocked={() => setLocation("/explore")}
                  />
                )}
              </div>
              {isLoggedIn ? (
                <>
                  <EmailVerificationBanner />
                  <BookingForm
                    guide={guide}
                    onSuccess={(reservationId) => setLocation(`/reservation/${reservationId}`)}
                  />
                </>
              ) : (
                <div className="bg-background border border-border rounded-2xl p-6 shadow-lg">
                  <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${Math.min(guide.prices.h4, guide.prices.h6, guide.prices.h8)}</span>
                      <span className="text-muted-foreground">/person</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <i className="fas fa-lock text-3xl text-muted-foreground mb-3"></i>
                      <h3 className="font-semibold mb-2">Sign in to book</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create an account or sign in to book tours with {displayName.split(" ")[0]}
                      </p>
                    </div>

                    <Button
                      className="w-full rainbow-gradient text-white hover:opacity-90"
                      onClick={() => setShowAuthModal(true)}
                    >
                      Sign In to Book
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      New to Rainbow Tour Guides?{" "}
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="text-primary hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Share Bar - Mobile/Tablet */}
        <div className="lg:hidden mt-6">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-center">
            <ShareButtons
              title={`Meet ${displayName} - LGBTQ+ Tour Guide in ${guide.city}`}
              description={guide.bio.substring(0, 150)}
              compact
            />
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        contextMessage={`Sign in to book with ${displayName.split(" ")[0]}`}
      />
    </div>
  );
}
