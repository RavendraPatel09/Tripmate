"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Cloud, Clock, Heart, Share2, Map as MapIcon, Utensils, Bed, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_DESTINATIONS } from "@/data/mockData";

export default function DestinationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const destination = MOCK_DESTINATIONS.find(d => d.id === resolvedParams.id) || MOCK_DESTINATIONS[0];
  const [isWished, setIsWished] = useState(false);

  return (
    <div className="pb-20">
      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button variant="secondary" size="icon" className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80" onClick={() => setIsWished(!isWished)}>
            <Heart className={`h-5 w-5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8 lg:p-12">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {destination.categories.map(cat => (
                <Badge key={cat} variant="outline" className="text-white border-white/30 bg-black/20 backdrop-blur-md">
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{destination.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-white/60">(4.2k reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                <span>{destination.weather}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{destination.distance} away</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">About {destination.name.split(',')[0]}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {destination.description} This stunning location offers a perfect blend of natural beauty, cultural heritage, and modern amenities. Whether you are looking for thrilling adventures or peaceful relaxation, it has something to offer for every kind of traveler.
            </p>
          </section>

          <section>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6">Overview</TabsTrigger>
                <TabsTrigger value="places" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6">Famous Places</TabsTrigger>
                <TabsTrigger value="culture" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6">Culture & History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/50 p-6 rounded-2xl border">
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Best Time to Visit</h3>
                    <p className="text-sm text-muted-foreground">October to March is ideal for sightseeing and outdoor activities when the weather is pleasant.</p>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-2xl border">
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Camera className="h-4 w-4 text-primary" /> Top Activities</h3>
                    <p className="text-sm text-muted-foreground">Photography, Trekking, Heritage Walks, Local Food Tasting.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="places">
                <p className="text-muted-foreground">List of famous places will go here...</p>
              </TabsContent>

              <TabsContent value="culture">
                <p className="text-muted-foreground">Details about local customs, language, and history...</p>
              </TabsContent>
            </Tabs>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-muted/30 border rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-4">Plan Your Trip</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-muted-foreground flex items-center gap-2"><MapIcon className="h-4 w-4" /> Distance</span>
                  <span className="font-semibold">{destination.distance}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Travel Time</span>
                  <span className="font-semibold">{destination.travelTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Budget Type</span>
                  <Badge variant="secondary" className="capitalize">{destination.budget}</Badge>
                </div>
              </div>
              <Button className="w-full text-lg h-12">Generate Itinerary</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Utensils className="h-6 w-6 text-primary" />
                <span>Find Food</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Bed className="h-6 w-6 text-primary" />
                <span>Hotels</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
