"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Activity, Mountain, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_HIDDEN_GEMS } from "@/data/mockData";

export default function HiddenGemsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Secret Spots</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Hidden Gems</h1>
        <p className="text-xl text-muted-foreground">
          Escape the crowds and discover offbeat locations curated by local experts.
        </p>
      </div>

      <div className="space-y-12">
        {MOCK_HIDDEN_GEMS.map((gem, index) => (
          <motion.div
            key={gem.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl bg-background/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-[500px] overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 z-10" />
                  <img 
                    src={gem.photos[0]} 
                    alt={gem.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background shadow-sm border-none">
                      <Mountain className="w-3 h-3 mr-1" /> Premium Exclusive
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-background to-muted/30">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">{gem.name}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {gem.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        Crowd Level
                      </div>
                      <p className="font-semibold capitalize text-lg">{gem.crowdLevel}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <Activity className="w-4 h-4 mr-2 text-primary" />
                        Difficulty
                      </div>
                      <p className="font-semibold capitalize text-lg">{gem.difficultyLevel}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        Best Season
                      </div>
                      <p className="font-semibold text-lg">{gem.bestSeason}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <IndianRupee className="w-4 h-4 mr-2 text-primary" />
                        Est. Budget
                      </div>
                      <p className="font-semibold text-lg">₹{gem.estimatedBudget}</p>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Local Expert Tip</h4>
                        <p className="text-sm text-muted-foreground">{gem.localTips}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Simple IndianRupee icon since it was used
function IndianRupee(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}
