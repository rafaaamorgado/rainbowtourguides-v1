import { useState } from "react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "fa-rocket",
      color: "text-blue-500",
      faqs: [
        {
          question: "How does Rainbow Tour Guides work?",
          answer: "Rainbow Tour Guides connects LGBTQ+ travelers with verified local guides in cities worldwide. Simply browse guides, select your preferred duration (4, 6, or 8 hours), and submit a booking request. Your guide will confirm and coordinate details with you."
        },
        {
          question: "How do I book a tour?",
          answer: "Visit the Explore page, find a guide that matches your interests, click on their profile, and use the booking form. You'll need to select a date, tour duration, number of travelers, and can add special requests. After submitting, the guide will review and confirm your booking."
        },
        {
          question: "Is Rainbow Tour Guides free to use?",
          answer: "Creating an account and browsing guides is completely free. You only pay for the tours you book, with prices set by individual guides based on tour duration."
        }
      ]
    },
    {
      id: "booking-tours",
      title: "Booking & Tours",
      icon: "fa-calendar-check",
      color: "text-green-500",
      faqs: [
        {
          question: "How do I contact my guide?",
          answer: "Once your booking is confirmed, you'll receive the guide's contact information via email. You can also access booking details and guide contact info through your Traveler Dashboard."
        },
        {
          question: "Can I cancel or modify my booking?",
          answer: "Yes, you can request cancellations or modifications through your Traveler Dashboard. Please contact your guide directly as soon as possible if you need to make changes. Cancellation policies vary by guide."
        },
        {
          question: "What tour durations are available?",
          answer: "Guides offer tours in three standard durations: 4 hours, 6 hours, or 8 hours. Each guide sets their own pricing for these durations. You can discuss custom arrangements directly with your guide."
        },
        {
          question: "How many people can join a tour?",
          answer: "Most guides accommodate 1-4 travelers per tour. When booking, specify the number of travelers in your group. For larger groups, contact the guide directly to discuss availability and pricing."
        }
      ]
    },
    {
      id: "safety-verification",
      title: "Safety & Verification",
      icon: "fa-shield-check",
      color: "text-purple-500",
      faqs: [
        {
          question: "Are guides verified?",
          answer: "Yes, all guides go through a verification process. We verify their identity, local knowledge, and commitment to providing safe, inclusive experiences for LGBTQ+ travelers."
        },
        {
          question: "Is it safe to tour with Rainbow Tour Guides?",
          answer: "Safety is our top priority. All guides are verified, and we encourage travelers to review guide profiles, read reviews from other travelers, and communicate with guides before booking. Always meet in public places and follow general travel safety guidelines."
        },
        {
          question: "Can I see reviews from other travelers?",
          answer: "Yes, each guide profile displays reviews and ratings from previous travelers. These reviews help you make informed decisions about which guide is right for you."
        }
      ]
    },
    {
      id: "become-guide",
      title: "Becoming a Guide",
      icon: "fa-user-plus",
      color: "text-orange-500",
      faqs: [
        {
          question: "How do I become a guide?",
          answer: "Visit the 'Become a Guide' page and submit your application. You'll need to provide information about yourself, your city, languages spoken, and why you'd like to be a guide. Our team will review your application and contact you with next steps."
        },
        {
          question: "What are the requirements to be a guide?",
          answer: "You must be 18+, a local resident in your city, identify as LGBTQ+ or be a strong ally, and be passionate about sharing your city's culture and LGBTQ+ scene. You should be friendly, knowledgeable, and committed to providing safe, inclusive experiences."
        },
        {
          question: "How do guides set their prices?",
          answer: "Guides set their own rates for 4-hour, 6-hour, and 8-hour tours based on their experience, city, and tour offerings. We provide guidance on competitive pricing in your market."
        },
        {
          question: "How do I manage bookings as a guide?",
          answer: "Once approved, you'll have access to your Guide Dashboard where you can view booking requests, confirm or decline tours, manage your availability, and communicate with travelers."
        }
      ]
    },
    {
      id: "account-payment",
      title: "Account & Payment",
      icon: "fa-credit-card",
      color: "text-pink-500",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click 'Get Started' or 'Sign In' in the navigation, then use the demo login to explore the platform. In a production environment, you'd create an account with your email and password."
        },
        {
          question: "How do payments work?",
          answer: "This is a demo platform, so no real payments are processed. In a production environment, payment would be securely processed at the time of booking, with funds held until the tour is completed."
        },
        {
          question: "Can I update my profile information?",
          answer: "Yes, both travelers and guides can update their profile information, photos, and preferences through their respective dashboards."
        }
      ]
    },
    {
      id: "technical-support",
      title: "Technical Support",
      icon: "fa-headset",
      color: "text-teal-500",
      faqs: [
        {
          question: "I'm having trouble with the website. What should I do?",
          answer: "Try refreshing the page or clearing your browser cache. If issues persist, this is a demo application, so some features may be simulated. Contact support for assistance with persistent technical issues."
        },
        {
          question: "Is there a mobile app?",
          answer: "Currently, Rainbow Tour Guides is a web-based platform optimized for both desktop and mobile browsers. There is no dedicated mobile app at this time."
        },
        {
          question: "Which browsers are supported?",
          answer: "Rainbow Tour Guides works best on modern browsers including Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date for the best experience."
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <i className="fas fa-question-circle text-primary text-3xl"></i>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions about Rainbow Tour Guides
          </p>

          <div className="relative max-w-2xl mx-auto">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {searchQuery.trim() === "" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  const element = document.getElementById(category.id);
                  element?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 ${category.color}`}>
                    <i className={`fas ${category.icon} text-2xl`}></i>
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.faqs.length} articles</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.id} id={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${category.color}`}>
                  <i className={`fas ${category.icon} text-xl`}></i>
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.id}-${index}`}
                    className="border rounded-lg px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {searchQuery.trim() !== "" && filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords
            </p>
          </div>
        )}

        <Card className="mt-16 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <i className="fas fa-envelope text-primary"></i>
              Still need help?
            </CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/guides">
                <a className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <i className="fas fa-users mr-2"></i>
                  Browse Guides
                </a>
              </Link>
              <Link href="/become-guide">
                <a className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
                  <i className="fas fa-user-plus mr-2"></i>
                  Become a Guide
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
