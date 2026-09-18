"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Filter, Compass, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_DESTINATIONS } from "@/data/mockData";
import { useTripStore } from "@/store/useTripStore";

const CATEGORIES = ["All", "Mountains", "Beaches", "Adventure", "Wildlife", "Historical", "Spiritual", "Romantic"];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { addWishlist, wishlist, removeWishlist } = useTripStore();

  const filteredDestinations = MOCK_DESTINATIONS.filter(dest => {
    const matchesCategory = activeCategory === "All" || dest.categories.includes(activeCategory);
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleWishlist = (dest: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (wishlist.some(w => w.id === dest.id)) {
      removeWishlist(dest.id);
    } else {
      addWishlist(dest);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Destinations</h1>
          <p className="text-muted-foreground mt-1">Find your next perfect getaway.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input 
            placeholder="Search places..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Select defaultValue="trending">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="cheapest">Cheapest</SelectItem>
              <SelectItem value="highest-rated">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className="rounded-full whitespace-nowrap"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDestinations.map((dest, index) => {
          const isWished = wishlist.some(w => w.id === dest.id);
          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/destination/${dest.id}`}>
                <Card className="overflow-hidden group h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 z-20">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80"
                        onClick={(e) => toggleWishlist(dest, e)}
                      >
                        <Heart className={`h-4 w-4 ${isWished ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                      <Badge variant="secondary" className="bg-background/70 backdrop-blur-md text-foreground border-none">
                        ⭐ {dest.rating}
                      </Badge>
                      <Badge variant="secondary" className="bg-background/70 backdrop-blur-md text-foreground border-none capitalize">
                        {dest.budget}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{dest.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {dest.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5 text-primary" />
                        {dest.travelTime}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {dest.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-24">
          <div className="bg-muted inline-block p-4 rounded-full mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No destinations found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
