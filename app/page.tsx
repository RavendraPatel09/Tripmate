"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Map, Brain, Wallet, Utensils, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HeroSearch } from "@/components/home/hero-search";
import { MOCK_DESTINATIONS } from "@/data/mockData";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021')" }}
          />
        </div>

        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm mb-4 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">
              ✨ Meet your new AI Travel Assistant
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Travel smarter with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground to-primary">TripMate</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-200 max-w-2xl mx-auto leading-relaxed">
              Discover hidden gems, plan optimal routes, estimate budgets, and get an AI-generated itinerary tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/planner">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg font-medium shadow-xl hover:shadow-primary/30 transition-all w-full sm:w-auto">
                  Start Planning
                </Button>
              </Link>
              <Link href="/ai-generator">
                <Button variant="secondary" size="lg" className="rounded-full px-8 h-14 text-lg font-medium bg-white text-zinc-900 hover:bg-zinc-100 shadow-xl transition-all w-full sm:w-auto">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  Try AI Builder
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <HeroSearch />
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Popular Destinations</h2>
              <p className="text-muted-foreground text-lg">Explore the most visited places this season.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="mt-4 md:mt-0 group">
                View all destinations
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_DESTINATIONS.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group h-full border-none shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <Button size="icon" variant="secondary" className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 text-foreground">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <Badge variant="secondary" className="bg-background/70 backdrop-blur-md hover:bg-background/90 text-foreground border-none">
                        ⭐ {dest.rating}
                      </Badge>
                      <Badge variant="secondary" className="bg-background/70 backdrop-blur-md hover:bg-background/90 text-foreground border-none capitalize">
                        {dest.budget}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{dest.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {dest.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-primary" />
                        {dest.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="h-4 w-4 text-primary" />
                        {dest.travelTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            TripMate combines all the tools you need to plan the perfect trip in one unified, intelligent platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Map, title: "Smart Route Planner", desc: "Get step-by-step guidance from your door to the destination with multiple transport options." },
              { icon: Brain, title: "AI Trip Generator", desc: "Just tell us your budget and days, and our AI will build a complete day-wise itinerary." },
              { icon: Wallet, title: "Budget Estimator", desc: "Accurately predict your expenses for hotels, food, transport, and activities before you go." },
              { icon: Compass, title: "Hidden Gems", desc: "Discover offbeat locations and secret spots away from the massive tourist crowds." },
              { icon: Utensils, title: "Food Explorer", desc: "Find the best local delicacies, street foods, and highly-rated restaurants." },
              { icon: Heart, title: "Community", desc: "Share your travel stories, photos, and guides with a vibrant community of travelers." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-muted/50 border border-muted hover:bg-muted transition-colors text-left"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about TripMate.</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="bg-background px-6 rounded-lg mb-4 border shadow-sm">
              <AccordionTrigger className="text-left font-semibold">How accurate is the budget estimator?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our budget estimator uses real-time data from various providers and historical trip data from users. It generally provides an accuracy range of 85-90% depending on the season and dynamic pricing of hotels and flights.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-background px-6 rounded-lg mb-4 border shadow-sm">
              <AccordionTrigger className="text-left font-semibold">Can I book tickets directly on TripMate?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Currently, TripMate acts as an intelligent aggregator and planner. We provide the optimal routes and direct links to our partner websites where you can complete your bookings securely.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-background px-6 rounded-lg mb-4 border shadow-sm">
              <AccordionTrigger className="text-left font-semibold">Is the AI Planner free to use?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes! The core AI trip generation is completely free. We do offer a premium subscription for advanced features like live collaborative planning and offline maps.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
