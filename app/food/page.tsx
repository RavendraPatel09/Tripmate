"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_FOODS } from "@/data/mockData";

const FOOD_CATEGORIES = ["All", "Vegetarian", "Non-vegetarian", "Dessert", "Street Food", "Local Specialty"];

export default function FoodExplorerPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFoods = MOCK_FOODS.filter(food => {
    const matchesCategory = activeCategory === "All" || food.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Explorer</h1>
          <p className="text-muted-foreground mt-1">Discover local delicacies and highest-rated restaurants.</p>
        </div>
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search dishes or places..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
        {FOOD_CATEGORIES.map(category => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food, index) => (
          <motion.div
            key={food.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="overflow-hidden group h-full border-none shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                <img 
                  src={food.image} 
                  alt={food.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 z-20">
                  <Badge variant="secondary" className="bg-background/90 text-foreground font-semibold border-none">
                    ⭐ {food.rating}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 z-20">
                  <Badge className="bg-primary text-primary-foreground border-none">
                    ₹{food.price}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{food.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {food.description}
                </p>
                <div className="flex items-center text-sm text-muted-foreground gap-1 pt-4 border-t">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="line-clamp-1">{food.location}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredFoods.length === 0 && (
        <div className="text-center py-24">
          <div className="bg-muted inline-block p-4 rounded-full mb-4">
            <Utensils className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No food found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
